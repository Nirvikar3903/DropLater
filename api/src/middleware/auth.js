export function authenticate(req, res, next) {

    // Header looks like: "Bearer mysecrettoken123"
    const authHeader = req.headers['authorization'] || ''

    // Slice off the "Bearer " prefix (7 chars) to isolate the token
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null

    if (!token || token !== process.env.ADMIN_TOKEN) {
        res.status(401).json({ error: 'Unauthorized. Provide a valid Bearer token.' })
        return
    }

    // Valid token — hand off to the next middleware or route
    next()
}