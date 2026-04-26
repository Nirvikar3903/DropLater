import 'dotenv/config'     // ES module way to load .env — cleaner than dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import pino from 'pino'
import notesRouter from './routes/notes.routes.js'

// Logger — structured JSON, pretty-printed in dev
export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: { colorize: true }
    }
})

const app = express()

// ── Middleware ────────────────────────────────────────────
app.use(express.json())   // parse JSON request bodies

app.use(cors({
    origin: 'http://localhost:5173',  // only allow our React admin UI
    methods: ['GET', 'POST']
}))

// ── Routes ────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ ok: true })
})

app.use('/api/notes', notesRouter)

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// ── Connect to MongoDB then start listening ───────────────
const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/droplater'

async function start() {
    try {
        await mongoose.connect(MONGO_URI)
        logger.info('Connected to MongoDB')

        app.listen(PORT, () => {
            logger.info(`API running on http://localhost:${PORT}`)
        })
    } catch (err) {
        logger.error({ err }, 'Failed to start')
        process.exit(1)
    }
}

start()