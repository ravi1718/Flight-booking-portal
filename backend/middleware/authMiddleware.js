const { verifyToken } = require('@clerk/backend');

const protect = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const token = header.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        });
        req.auth = { userId: payload.sub };
        next();
    } catch (err) {
        console.error('[Auth] Clerk verifyToken failed — name:', err.name, '| message:', err.message);
        if (err.errors) console.error('[Auth] Clerk errors:', JSON.stringify(err.errors));
        res.status(401).json({ message: 'Token invalid or expired' });
    }
};

module.exports = { protect };
