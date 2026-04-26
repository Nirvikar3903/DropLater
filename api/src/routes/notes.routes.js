import { Router } from 'express'
import crypto from 'crypto'        // built-in Node.js module, no install needed
import { Note } from '../models/note.model.js'
import { authenticate } from '../middleware/auth.js'
import { validate, CreateNoteSchema } from '../middleware/validate.js'
import { scheduleDelivery } from '../services/queue.service.js'

const router = Router()

// Every route below requires a valid Bearer token
router.use(authenticate)


// ── POST / ── Create a note ──────────────────────────────
router.post('/', validate(CreateNoteSchema), async (req, res) => {
    try {
        const { title, body, releaseAt, webhookUrl } = req.body
        const releaseAtDate = new Date(releaseAt)

        // Save with a temp key first — we need MongoDB's _id to build the real key
        const note = await Note.create({
            title,
            body,
            releaseAt: releaseAtDate,
            webhookUrl,
            idempotencyKey: crypto.randomUUID(),
            status: 'pending',
            attempts: [],
            deliveredAt: null
        })

        // Real key: sha256(noteId:releaseAt)
        // Deterministic — same note + same time always produces the same hash
        // This means every retry of this note carries the exact same key
        const idempotencyKey = crypto
            .createHash('sha256')
            .update(`${note._id.toString()}:${releaseAtDate.toISOString()}`)
            .digest('hex')

        note.idempotencyKey = idempotencyKey
        await note.save()

        // Queue the delivery job — fires at releaseAt
        await scheduleDelivery(note._id.toString(), webhookUrl, idempotencyKey, releaseAtDate)

        res.status(201).json({
            id: note._id,
            status: note.status,
            releaseAt: note.releaseAt,
            createdAt: note.createdAt
        })

    } catch (err) {
        console.error('Failed to create note:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
})


// ── GET / ── List notes ──────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const status = req.query.status
        const page = Math.max(1, Number(req.query.page) || 1)
        const pageSize = 20

        const filter = {}
        const validStatuses = ['pending', 'delivered', 'failed', 'dead']
        if (status && validStatuses.includes(status)) {
            filter.status = status
        }

        const total = await Note.countDocuments(filter)

        const notes = await Note.find(filter)
            .sort({ createdAt: -1 })            // newest first
            .skip((page - 1) * pageSize)        // skip pages before this one
            .limit(pageSize)                    // take only 20 results
            .lean()                             // plain JS objects — faster than Mongoose docs

        res.json({
            data: notes,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        })

    } catch (err) {
        console.error('Failed to list notes:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
})


// ── POST /:id/replay ── Requeue a failed or dead note ────
router.post('/:id/replay', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            res.status(404).json({ error: 'Note not found' })
            return
        }

        if (!['failed', 'dead'].includes(note.status)) {
            res.status(400).json({
                error: `Cannot replay a note with status '${note.status}'. Only failed or dead notes can be replayed.`
            })
            return
        }

        // Fresh idempotency key for replay
        // New key = sink sees this as a brand new delivery, not a duplicate
        const replayedAt = new Date()
        const newIdempotencyKey = crypto
            .createHash('sha256')
            .update(`replay:${note._id.toString()}:${replayedAt.toISOString()}`)
            .digest('hex')

        // Reset note to a clean state
        note.status = 'pending'
        note.idempotencyKey = newIdempotencyKey
        note.attempts = []
        note.deliveredAt = null
        await note.save()

        // Deliver immediately — delay 0
        await scheduleDelivery(note._id.toString(), note.webhookUrl, newIdempotencyKey, new Date())

        res.json({ message: 'Note requeued for delivery', id: note._id })

    } catch (err) {
        console.error('Failed to replay note:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default router