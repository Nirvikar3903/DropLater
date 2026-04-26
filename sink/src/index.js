import 'dotenv/config'
import express from 'express'
import Redis from 'ioredis'
import pino from 'pino'

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: { target: 'pino-pretty', options: { colorize: true } }
})

const app = express()
app.use(express.json())

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379
})

redis.on('connect', () => logger.info('Sink connected to Redis ✅'))
redis.on('error', (err) => logger.error({ err }, 'Redis error'))

app.get('/health', (req, res) => res.json({ ok: true }))

app.post('/sink', async (req, res) => {
    try {
        const idempotencyKey = req.headers['x-idempotency-key']
        const noteId = req.headers['x-note-id']
        const attemptNumber = req.headers['x-attempt-number']

        if (!idempotencyKey) {
            return res.status(400).json({ error: 'Missing X-Idempotency-Key header' })
        }

        if (process.env.SINK_FORCE_FAIL === 'true') {
            logger.warn({ noteId }, 'Force fail ON — returning 500')
            return res.status(500).json({ error: 'Simulated failure' })
        }

        const result = await redis.set(
            `idempotency:${idempotencyKey}`,
            '1', 'NX', 'EX', 86400
        )

        if (result === null) {
            logger.info({ noteId, attemptNumber }, 'Duplicate delivery ignored ♻️')
            return res.status(200).json({ status: 'duplicate' })
        }

        logger.info({ noteId, attemptNumber, body: req.body }, '✅ Note delivered!')
        return res.status(200).json({ status: 'accepted' })

    } catch (err) {
        logger.error({ err }, 'Sink error')
        return res.status(500).json({ error: 'Internal server error' })
    }
})

const PORT = process.env.SINK_PORT || 4000
app.listen(PORT, () => logger.info(`Sink running on http://localhost:${PORT}`))