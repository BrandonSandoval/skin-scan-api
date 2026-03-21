const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const app = express();

// Allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000', // local dev
    'https://skin-scan-frontend.onrender.com', // if you deploy frontend separately
    'https://skin-scan-api.onrender.com', // if serving frontend+backend in one container
];

/**
 * Security middleware: Helmet.js for HTTP security headers
 * Sets X-Frame-Options, HSTS, CSP, X-Content-Type-Options, etc.
 */
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust for your needs
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        hsts: {
            maxAge: 31536000, // 1 year in seconds
            includeSubDomains: true,
            preload: true,
        },
        frameguard: {
            action: 'deny', // X-Frame-Options
        },
        noSniff: true, // X-Content-Type-Options
        xssFilter: true, // X-XSS-Protection
    }),
);

/**
 * CORS middleware with strict origin validation
 */
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl requests, or same-origin)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

/**
 * Body size limit to prevent DoS attacks
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

/**
 * Global rate limiter for all routes (permissive, can be adjusted)
 * More strict limits applied to auth endpoints in their router
 * Currently disabled but kept for reference
 */
// const globalLimiter = rateLimit({
//     windowMs: 60 * 1000, // 1 minute
//     max: 100, // 100 requests per minute per IP
//     message: 'Too many requests from this IP, please try again later',
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

// Apply global rate limiting (optional - comment out if too restrictive)
// app.use(globalLimiter);

/**
 * Middleware for request logging and validation
 */
app.use((req, res, next) => {
    // Log basic request info in development
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
});

// --- API routes ---
app.use('/api/auth', require('./api/auth'));
app.use('/api/predict', require('./api/predict'));
app.use('/api/history', require('./api/history'));
app.use('/api/feedback', require('./api/feedback'));
app.use('/api/dashboard', require('./api/dashboard'));
app.use('/api/metrics', require('./api/metrics'));

// --- Health check / root ---
app.get('/healthz', (req, res) => res.status(200).json({ status: 'OK' }));
app.get('/api', (req, res) => res.status(200).json({ message: 'SkinScan API is running!' }));

/**
 * Error handling middleware
 * Catch 404s and format consistent error responses
 */
app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
        // For non-API routes, continue to static file serving
        return;
    }
    res.status(404).json({ error: 'Not found' });
});

/**
 * Global error handler
 * Ensures consistent error response format
 */
app.use((err, req, res) => {
    const logger = require('./utils/logger');

    // Log the error
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Default to 500 if no status code
    const status = err.status || 500;
    const message = err.message || 'Internal server error';

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { details: err.stack }),
    });
});

// --- Serve frontend (Next.js static export) ---
app.use(express.static(path.join(__dirname, 'public')));

// Always fallback to index.html for client-side routes
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Fix for SPA routes (e.g. /register, /login, /dashboard on refresh)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        const filePath = path.join(__dirname, 'public', req.path, 'index.html');

        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        }
    }
});

// --- For testing (optional) ---
let server;
if (process.env.NODE_ENV === 'test') {
    server = app.listen(0); // ephemeral port
}

const closeServer = () => {
    return new Promise((resolve) => {
        if (server) {
            server.close(resolve);
        } else {
            resolve();
        }
    });
};

module.exports = app;
module.exports.closeServer = closeServer;

// --- Start server normally ---
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    // eslint-disable-next-line no-console
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`SkinScan running on port ${PORT}`);
    });
}
