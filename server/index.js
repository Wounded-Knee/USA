const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./utils/database');
const errorHandler = require('./middleware/errorHandler');
const { corsOptions, helmetConfig, securityHeaders, idempotencyKey, etagMiddleware } = require('./middleware/security');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced security middleware
app.use(helmet(helmetConfig));
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(idempotencyKey);
app.use(etagMiddleware);

// Standard middleware
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import passport configuration
require('./config/passport');

// Serve static files for uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the USA Backend API',
    version: '1.0',
    documentation: '/v1/docs'
  });
});

// API Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0'
  });
});

// Legacy API Routes (deprecated)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/data', require('./routes/data'));
app.use('/api/petitions', require('./routes/petitions'));
app.use('/api/votes', require('./routes/votes'));
app.use('/api/vigor', require('./routes/vigor'));
app.use('/api/government', require('./routes/government'));
app.use('/api/media', require('./routes/media'));

// New v1 API Routes
app.use('/v1/auth', require('./routes/v1/auth'));
app.use('/v1/users', require('./routes/v1/users'));
app.use('/v1/roles', require('./routes/v1/roles'));
app.use('/v1/petitions', require('./routes/v1/petitions'));
app.use('/v1/gov', require('./routes/v1/gov'));
app.use('/v1/media', require('./routes/v1/media'));
app.use('/v1/analytics', require('./routes/v1/analytics'));

// API Documentation
app.get('/v1/docs', (req, res) => {
  res.json({
    message: 'API Documentation',
    version: '1.0',
    endpoints: {
      auth: {
        description: 'Authentication endpoints',
        base: '/v1/auth',
        endpoints: [
          'POST /register - Register new user',
          'POST /login - Authenticate user',
          'POST /logout - Logout user',
          'POST /refresh - Refresh access token',
          'GET /me - Get current user profile',
          'GET /oauth/:provider - OAuth authentication',
          'GET /oauth/:provider/callback - OAuth callback'
        ]
      },
      users: {
        description: 'User management endpoints',
        base: '/v1/users',
        endpoints: [
          'GET / - List users',
          'POST / - Create user (admin only)',
          'GET /:userId - Get user by ID',
          'PATCH /:userId - Update user',
          'DELETE /:userId - Deactivate user',
          'GET /:userId/roles - Get user roles',
          'PUT /:userId/roles - Update user roles',
          'POST /:userId/roles - Add role to user',
          'DELETE /:userId/roles/:role - Remove role from user',
          'GET /:userId/media - Get user media',
          'POST /:userId/media - Upload user media'
        ]
      },
      roles: {
        description: 'Role management endpoints',
        base: '/v1/roles',
        endpoints: [
          'GET / - List available roles',
          'GET /scopes - List available scopes'
        ]
      },
      petitions: {
        description: 'Petition management endpoints',
        base: '/v1/petitions',
        endpoints: [
          'GET / - List petitions',
          'POST / - Create petition',
          'GET /:petitionId - Get petition by ID',
          'PATCH /:petitionId - Update petition',
          'DELETE /:petitionId - Delete petition',
          'GET /:petitionId/votes - Get petition votes',
          'POST /:petitionId/votes - Vote on petition',
          'GET /:petitionId/votes/:voteId - Get specific vote',
          'GET /:petitionId/vigor - Get petition vigor',
          'POST /:petitionId/vigor - Contribute vigor',
          'GET /:petitionId/media - Get petition media',
          'POST /:petitionId/media - Upload petition media'
        ]
      },
      gov: {
        description: 'Government data endpoints',
        base: '/v1/gov',
        endpoints: [
          'GET /jurisdictions - List jurisdictions',
          'GET /jurisdictions/:id - Get jurisdiction by ID',
          'GET /governing-bodies - List governing bodies',
          'GET /governing-bodies/:id - Get governing body by ID',
          'GET /offices - List offices',
          'GET /offices/:id - Get office by ID',
          'GET /positions - List positions',
          'GET /positions/:id - Get position by ID',
          'GET /elections - List elections',
          'GET /elections/:id - Get election by ID',
          'GET /legislation - List legislation',
          'GET /legislation/:id - Get legislation by ID'
        ]
      },
      media: {
        description: 'Media management endpoints',
        base: '/v1/media',
        endpoints: [
          'GET / - List media',
          'POST / - Upload media',
          'GET /:mediaId - Get media by ID',
          'PATCH /:mediaId - Update media',
          'DELETE /:mediaId - Delete media'
        ]
      },
      analytics: {
        description: 'Analytics endpoints',
        base: '/v1/analytics',
        endpoints: [
          'GET /platform - Platform statistics',
          'GET /votes - Vote analytics',
          'GET /petitions/trending - Trending petitions',
          'GET /vigor - Vigor analytics'
        ]
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>'
    },
    pagination: {
      type: 'Page-based',
      parameters: 'page, page_size'
    },
    filtering: {
      type: 'Query parameters',
      example: '?filter[category]=environment&sort=-createdAt'
    },
    response_format: {
      success: {
        data: 'Resource or array of resources',
        meta: 'Pagination and metadata'
      },
      error: {
        type: 'RFC 7807 Problem Details',
        fields: 'type, title, status, detail, errors'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    type: 'https://api.example.com/errors/not-found',
    title: 'Route not found',
    status: 404,
    detail: `The requested route ${req.originalUrl} was not found`,
    instance: req.originalUrl
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}`);
      console.log(`🔗 Frontend should be at http://localhost:3000`);
      console.log(`📚 API Documentation at http://localhost:${PORT}/v1/docs`);
      console.log(`⚡ New v1 API at http://localhost:${PORT}/v1`);
      console.log(`⚠️  Legacy API at http://localhost:${PORT}/api (deprecated)`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
