import { z } from 'zod'

// Describes exactly what a valid create-note request body must look like
export const CreateNoteSchema = z.object({

    title: z
        .string({ required_error: 'Title is required' })
        .min(1, 'Title cannot be empty')
        .max(200, 'Title is too long'),

    body: z
        .string({ required_error: 'Body is required' })
        .min(1, 'Body cannot be empty')
        .max(10000, 'Body is too long'),

    releaseAt: z
        .string({ required_error: 'releaseAt is required' })
        // checks it is a proper ISO-8601 UTC string e.g. "2025-09-01T14:00:00.000Z"
        .datetime({ message: 'releaseAt must be a valid ISO-8601 UTC date string' }),

    webhookUrl: z
        .string({ required_error: 'webhookUrl is required' })
        .url('webhookUrl must be a valid URL')
        .refine(
            url => url.startsWith('http://') || url.startsWith('https://'),
            'webhookUrl must start with http:// or https://'
        )
})

// Factory function — takes any Zod schema, returns Express middleware
// Usage: router.post('/', validate(CreateNoteSchema), handler)
export function validate(schema) {
    return (req, res, next) => {

        // safeParse never throws — always returns { success, data } or { success, error }
        const result = schema.safeParse(req.body)

        if (!result.success) {
            const details = result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))

            res.status(400).json({ error: 'Validation failed', details })
            return
        }

        // Overwrite req.body with clean validated data
        req.body = result.data
        next()
    }
}