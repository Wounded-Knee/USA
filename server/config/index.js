/**
 * Server Configuration
 * 
 * This file extends the shared configuration with server-specific settings.
 */

const { sharedConfig } = require('../../shared/config.js');

// Server-specific configuration
const serverConfig = {
  ...sharedConfig,

  // Server-specific overrides
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
  },

  // Database
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    bcryptRounds: 12,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      authMax: 5, // limit auth endpoints to 5 requests per windowMs
    },
  },

  // File uploads
  uploads: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    destination: './uploads',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  },
};

module.exports = serverConfig;