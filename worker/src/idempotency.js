import crypto from 'crypto'

export function generateKey(noteId, releaseAt) {
    const input = `${noteId}:${new Date(releaseAt).toISOString()}`
    return crypto.createHash('sha256').update(input).digest('hex')
}

export function generateReplayKey(noteId, replayedAt) {
    const input = `replay:${noteId}:${new Date(replayedAt).toISOString()}`
    return crypto.createHash('sha256').update(input).digest('hex')
}
