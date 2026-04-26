import mongoose from 'mongoose'
import { logger } from './logger.js'

const attemptSchema = new mongoose.Schema({
    at: { type: Date },
    statusCode: { type: Number },
    ok: { type: Boolean },
    error: { type: String },
    durationMs: { type: Number }
}, { _id: false })

const noteSchema = new mongoose.Schema(
    {
        title: { type: String },
        body: { type: String },
        releaseAt: { type: Date },
        webhookUrl: { type: String },
        status: {
            type: String,
            enum: ['pending', 'delivered', 'failed', 'dead'],
            default: 'pending'
        },
        idempotencyKey: { type: String },
        attempts: [attemptSchema],
        deliveredAt: { type: Date, default: null }
    },
    { timestamps: true }
)

export const Note = mongoose.model('Note', noteSchema)

export async function connectDB() {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/droplater'
    await mongoose.connect(uri)
    logger.info('Worker connected to MongoDB ✅')
}