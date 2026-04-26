import mongoose from 'mongoose'

// Shape of one delivery attempt
// _id: false means mongoose won't add an _id to each attempt object
const attemptSchema = new mongoose.Schema({
    at: { type: Date, required: true },  // when the attempt happened
    statusCode: { type: Number },                   // HTTP status from webhook (200, 500 etc)
    ok: { type: Boolean, required: true },  // true = delivered, false = failed
    error: { type: String },                   // error message if request failed
    durationMs: { type: Number }                    // how long the HTTP call took in ms
}, { _id: false })

// Main Note schema
const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,   // strips accidental whitespace from both ends
            maxlength: 200
        },

        body: {
            type: String,
            required: true,
            maxlength: 10000
        },

        releaseAt: {
            type: Date,
            required: true    // when to fire the delivery
        },

        webhookUrl: {
            type: String,
            required: true    // where to POST the note payload
        },

        status: {
            type: String,
            enum: ['pending', 'delivered', 'failed', 'dead'],
            default: 'pending'  // all notes start as pending
        },

        idempotencyKey: {
            type: String,
            required: true,
            unique: true  // prevents two notes sharing the same key
        },

        // grows by one object every delivery attempt
        attempts: [attemptSchema],

        deliveredAt: {
            type: Date,
            default: null  // stays null until successfully delivered
        }
    },
    {
        timestamps: true  // auto-manages createdAt and updatedAt
    }
)

// ── Indexes ──────────────────────────────────────────────
// Worker polling query: pending notes where releaseAt <= now
noteSchema.index({ releaseAt: 1, status: 1 })

// List endpoint filter: GET /api/notes?status=failed
noteSchema.index({ status: 1 })

export const Note = mongoose.model('Note', noteSchema)