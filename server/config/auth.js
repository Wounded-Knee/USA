/**
 * Authentication Configuration
 * 
 * This file contains all authentication-related configuration settings
 * including JWT token expiration times, cookie settings, and security parameters.
 */

const { sharedConfig } = require('../../shared/config.js');

const authConfig = {
  // JWT Token Expiration Settings
  jwt: {
    // Access token expiration (short-lived for security)
    accessTokenExpiry: sharedConfig.auth.tokenExpiry,
    
    // Refresh token expiration (longer-lived for user convenience)
    refreshTokenExpiry: sharedConfig.auth.refreshTokenExpiry,
    
    // Test token expiration (for development/testing scripts)
    testTokenExpiry: '1h',
  },

  // Cookie Settings
  cookies: {
    // Refresh token cookie name
    refreshTokenName: sharedConfig.auth.cookieName,
    
    // Cookie security settings
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    
    // Calculate maxAge in milliseconds from refresh token expiry
    get maxAge() {
      // Convert '7d' to milliseconds
      const days = parseInt(this.refreshTokenExpiry.replace('d', ''));
      return days * 24 * 60 * 60 * 1000;
    },
    
    // Reference to refresh token expiry for maxAge calculation
    refreshTokenExpiry: '7d',
  },

  // Password Security
  password: {
    // Bcrypt salt rounds for password hashing
    saltRounds: 12,
  },

  // Default User Scopes
  defaultScopes: sharedConfig.auth.defaultScopes,

  // OAuth Settings
  oauth: {
    // Supported OAuth providers
    supportedProviders: ['google', 'apple'],
    
    // OAuth scopes
    scopes: ['profile', 'email'],
  },

  // Rate Limiting
  rateLimit: {
    // Auth endpoints rate limit (requests per window)
    authRequestsPerWindow: 5,
    
    // Rate limit window in minutes
    windowMs: 15 * 60 * 1000, // 15 minutes
  }
};

module.exports = authConfig;
