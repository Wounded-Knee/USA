const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Rate limiting configurations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    type: 'https://api.example.com/errors/rate-limit',
    title: 'Too many authentication attempts',
    status: 429,
    detail: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    type: 'https://api.example.com/errors/rate-limit',
    title: 'Too many requests',
    status: 429,
    detail: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per window
  message: {
    type: 'https://api.example.com/errors/rate-limit',
    title: 'Too many uploads',
    status: 429,
    detail: 'Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Hardcode allowed origins to avoid environment variable issues
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Idempotency-Key',
    'If-Match',
    'If-None-Match'
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'ETag',
    'Link'
  ],
};

// Enhanced Helmet configuration
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // HSTS header (only in production)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
};

// File upload security middleware
const uploadSecurity = (req, res, next) => {
  // Validate file size
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxFileSize) {
    return res.status(413).json({
      type: 'https://api.example.com/errors/file-too-large',
      title: 'File too large',
      status: 413,
      detail: 'File size exceeds maximum allowed size of 10MB',
    });
  }
  
  next();
};

// Idempotency key middleware
const idempotencyKey = (req, res, next) => {
  const idempotencyKey = req.headers['idempotency-key'];
  
  if (req.method === 'POST' && idempotencyKey) {
    // TODO: Implement idempotency key storage and checking
    // This would typically involve storing the key in Redis or database
    // and checking for existing requests with the same key
    console.log('Idempotency key received:', idempotencyKey);
  }
  
  next();
};

// ETag middleware for caching
const etagMiddleware = (req, res, next) => {
  // Add ETag support for GET requests
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'private, max-age=300'); // 5 minutes
  }
  
  next();
};

// Brute force protection middleware
const bruteForceProtection = (req, res, next) => {
  // TODO: Implement per-IP and per-account brute force protection
  // This would typically involve tracking failed attempts in Redis
  // and implementing incremental backoff
  
  next();
};

module.exports = {
  authLimiter,
  generalLimiter,
  uploadLimiter,
  corsOptions,
  helmetConfig,
  securityHeaders,
  uploadSecurity,
  idempotencyKey,
  etagMiddleware,
  bruteForceProtection,
};

