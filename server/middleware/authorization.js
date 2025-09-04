const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// Role definitions with associated scopes
const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  DEVELOPER: 'developer',
  USER: 'user',
};

// Scope definitions
const SCOPES = {
  // User management
  'users:read': 'Read user profiles',
  'users:write': 'Create and update users',
  'users:delete': 'Delete users',
  

  
  // Media
  'media:read': 'Read media',
  'media:write': 'Upload media',
  'media:delete': 'Delete media',
  
  // Roles and permissions
  'roles:read': 'Read roles',
  'roles:assign': 'Assign roles to users',
  
  // Government data
  'gov:read': 'Read government data',
  
  
  // Identities
  'identities:read': 'Read political identities',
};

// Role to scope mappings
const ROLE_SCOPES = {
  [ROLES.ADMIN]: [
    'users:read', 'users:write', 'users:delete',
    'media:read', 'media:write', 'media:delete',
    'roles:read', 'roles:assign',
    'gov:read',
    'identities:read',
  ],
  [ROLES.MODERATOR]: [
    'users:read',
    'media:read', 'media:write',
    'gov:read',
    'identities:read',
  ],
  [ROLES.DEVELOPER]: [
    'users:read', 'users:write',
    'media:read', 'media:write',
    'roles:read',
    'gov:read',
    'identities:read',
  ],
  [ROLES.USER]: [
    'users:read',
    'media:read', 'media:write',
    'gov:read',
    'identities:read',
  ],
};

// JWT token verification middleware
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/unauthorized`,
        title: 'Authentication required',
        status: 401,
        detail: 'Bearer token is required',
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is active
    const user = await User.findById(decoded.sub).select('+roles +isActive');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/unauthorized`,
        title: 'Invalid token',
        status: 401,
        detail: 'User not found or inactive',
      });
    }
    
    // Resolve scopes from roles
    const scopes = [];
    if (user.roles && Array.isArray(user.roles)) {
      // user.roles contains role names as strings, so we can directly use them
      user.roles.forEach(roleName => {
        if (ROLE_SCOPES[roleName]) {
          scopes.push(...ROLE_SCOPES[roleName]);
        }
      });
    }
    
    // Add user info to request
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles || [],
      scopes: [...new Set(scopes)], // Remove duplicates
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/unauthorized`,
        title: 'Invalid token',
        status: 401,
        detail: 'Token is invalid or expired',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/unauthorized`,
        title: 'Token expired',
        status: 401,
        detail: 'Token has expired',
      });
    }
    
    next(error);
  }
};

// Scope-based authorization middleware
const requireScope = (requiredScope) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/unauthorized`,
        title: 'Authentication required',
        status: 401,
        detail: 'User must be authenticated',
      });
    }
    
    if (!req.user.scopes.includes(requiredScope)) {
      return res.status(403).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/forbidden`,
        title: 'Insufficient permissions',
        status: 403,
        detail: `Scope '${requiredScope}' is required`,
      });
    }
    
    next();
  };
};

// Role-based authorization middleware
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/unauthorized`,
        title: 'Authentication required',
        status: 401,
        detail: 'User must be authenticated',
      });
    }
    
    if (!req.user.roles.includes(requiredRole)) {
      return res.status(403).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/forbidden`,
        title: 'Insufficient permissions',
        status: 403,
        detail: `Role '${requiredRole}' is required`,
      });
    }
    
    next();
  };
};

// Ownership-based authorization middleware
const requireOwnership = (resourceType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/unauthorized`,
        title: 'Authentication required',
        status: 401,
        detail: 'User must be authenticated',
      });
    }
    
    // Check if user owns the resource or has admin role
    const resourceId = req.params.userId || req.params.id;
    const isOwner = resourceId === req.user.id;
    const isAdmin = req.user.roles.includes(ROLES.ADMIN);
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        type: `${process.env.NEXT_PUBLIC_API_URL}/errors/forbidden`,
        title: 'Access denied',
        status: 403,
        detail: `You can only access your own ${resourceType}`,
      });
    }
    
    next();
  };
};

// Optional authentication middleware (for public endpoints)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.sub).select('+roles +isActive');
      
      if (user && user.isActive) {
        const scopes = [];
        if (user.roles && Array.isArray(user.roles)) {
          user.roles.forEach(roleName => {
            if (ROLE_SCOPES[roleName]) {
              scopes.push(...ROLE_SCOPES[roleName]);
            }
          });
        }
        
        req.user = {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles || [],
          scopes: [...new Set(scopes)],
        };
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

module.exports = {
  verifyToken,
  requireScope,
  requireRole,
  requireOwnership,
  optionalAuth,
  ROLES,
  SCOPES,
  ROLE_SCOPES,
};

