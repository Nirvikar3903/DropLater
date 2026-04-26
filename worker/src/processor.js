import axios from 'axios'
import { Note } from './db.js'
import { logger } from './logger.js'

export async function processor(job) {
    const { noteId, webhookUrl, idempotencyKey } = job.data
    const attemptNumber = job.attemptsMade + 1
    const startTime = Date.now()

    logger.info({ noteId, attemptNumber }, 'Starting delivery attempt')

    try {
        const note = await Note.findById(noteId)
        if (!note) throw new Error(`Note ${noteId} not found`)

        const payload = {
            id: note._id.toString(),
            title: note.title,
            body: note.body,
            releaseAt: note.releaseAt,
            sentAt: new Date().toISOString()
        }

        const response = await axios.post(webhookUrl, payload, {
            timeout: Number(process.env.DELIVERY_TIMEOUT_MS) || 5000,
            headers: {
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey,
                'X-Attempt-Number': String(attemptNumber),
                'X-Note-Id': noteId
            },
            validateStatus: () => true
        })

        const durationMs = Date.now() - startTime
        const ok = response.status >= 200 && response.status < 300

        await Note.findByIdAndUpdate(noteId, {
            $push: {
                attempts: {
                    at: new Date(), statusCode: response.status, ok, durationMs
                }
            }
        })

        if (ok) {
            await Note.findByIdAndUpdate(noteId, {
                $set: { status: 'delivered', deliveredAt: new Date() }
            })
            logger.info({ noteId, attemptNumber, statusCode: response.status, durationMs }, 'Delivery succeeded ✅')
            return { success: true, statusCode: response.status }

        } else {
            await Note.findByIdAndUpdate(noteId, { $set: { status: 'failed' } })
            logger.warn({ noteId, attemptNumber, statusCode: response.status }, 'Webhook returned non-2xx ❌')
            throw new Error(`Webhook returned ${response.status}`)
        }

    } catch (err) {
        const durationMs = Date.now() - startTime

        if (!err.message.startsWith('Webhook returned')) {
            await Note.findByIdAndUpdate(noteId, {
                $push: {
                    attempts: {
                        at: new Date(), statusCode: null, ok: false,
                        error: err.message, durationMs
                    }
                },
                $set: { status: 'failed' }
            })
        }

        logger.error({ noteId, attemptNumber, error: err.message }, 'Delivery failed ❌')
        throw err
    }
}