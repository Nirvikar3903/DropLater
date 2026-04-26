import 'dotenv/config'
import { Worker } from 'bullmq'
import { processor } from './processor.js'
import { connectDB } from './db.js'
import { logger } from './logger.js'

const connection = {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379
}

async function start() {
    try {
        await connectDB()

        const worker = new Worker('notes', processor, {
            connection,
            concurrency: Number(process.env.WORKER_CONCURRENCY) || 5
        })

        worker.on('active', (job) => logger.info({ noteId: job.data.noteId }, 'Job active'))
        worker.on('completed', (job, res) => logger.info({ noteId: job.data.noteId }, 'Job completed ✅'))
        worker.on('failed', (job, err) => logger.error({ noteId: job?.data?.noteId, error: err.message }, 'Job dead ☠️'))
        worker.on('error', (err) => logger.error({ err }, 'Worker error'))

        logger.info('🚀 Worker running — waiting for jobs')

        process.on('SIGTERM', async () => {
            logger.info('Shutting down worker...')
            await worker.close(true)
            process.exit(0)
        })

    } catch (err) {
        logger.error({ err }, 'Failed to start worker')
        process.exit(1)
    }
}

start()