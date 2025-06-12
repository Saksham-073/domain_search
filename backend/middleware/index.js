const { v4: uuidv4 } = require('uuid');

function sessionMiddleware(req, res, next) {
    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
        sessionId = uuidv4();
        res.cookie('sessionId', sessionId, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false
        });
    }

    req.sessionId = sessionId;
    next();
}

function validateDomain(req, res, next) {
    const { domain } = req.query;

    if (!domain) {
        return res.status(400).json({ error: 'Domain parameter is required' });
    }

    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
        return res.status(400).json({ error: 'Invalid domain format' });
    }

    next();
}


function errorHandler(err, req, res, next) {
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(500).json({
        error: message,
        timestamp: new Date().toISOString()
    });
}


function requestLogger(req, res, next) {
    next();
}


function corsMiddleware(req, res, next) {
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173'
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }

    next();
}


function createRateLimiter(options = {}) {
    const {
        windowMs = 15 * 60 * 1000,
        maxRequests = 100,
        message = 'Too many requests, please try again later'
    } = options;

    const requests = new Map();

    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        for (const [key, data] of requests.entries()) {
            if (now - data.resetTime > windowMs) {
                requests.delete(key);
            }
        }

        let requestData = requests.get(ip);
        if (!requestData) {
            requestData = {
                count: 0,
                resetTime: now
            };
            requests.set(ip, requestData);
        }

        if (now - requestData.resetTime>windowMs) {
            requestData.count = 0;
            requestData.resetTime = now;
        }

        if (requestData.count >= maxRequests) {
            return res.status(429).json({
                error: message,
                retryAfter: Math.ceil((requestData.resetTime + windowMs-now)/1000)
            });
        }

        requestData.count++;

        next();
    };
}

module.exports = {
    sessionMiddleware,
    validateDomain,
    errorHandler,
    requestLogger,
    corsMiddleware,
    createRateLimiter
}; 