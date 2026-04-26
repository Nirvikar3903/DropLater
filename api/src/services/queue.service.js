import { Queue } from 'bullmq'

// 'redis' resolves to the Redis container on Docker's internal network
const connection = {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379
}

// One queue instance shared across the whole API process
// Worker listens to this same 'notes' queue name
export const notesQueue = new Queue('notes', { connection })

export async function scheduleDelivery(noteId, webhookUrl, idempotencyKey, releaseAt) {

    // ms from now until delivery time — 0 if releaseAt is already in the past
    const delay = Math.max(0, new Date(releaseAt).getTime() - Date.now())

    await notesQueue.add(
        'deliver',
        {
            noteId,          // worker uses this to fetch note from MongoDB
            webhookUrl,      // delivery destination
            idempotencyKey   // sent as X-Idempotency-Key header
        },
        {
            delay,
            attempts: Number(process.env.MAX_DELIVERY_ATTEMPTS) || 3,
            backoff: {
                type: 'exponential', // 1s → 5s → 25s
                delay: 1000
            },
            removeOnComplete: { count: 100 },
            removeOnFail: false  // keep failed jobs for debugging and replay
        }
    )
}