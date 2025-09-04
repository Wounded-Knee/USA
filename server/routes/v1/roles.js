const express = require('express');
const { verifyToken, requireScope, ROLES, SCOPES, ROLE_SCOPES } = require('../../middleware/authorization');
const { generalLimiter, securityHeaders } = require('../../middleware/security');
const { success, error } = require('../../utils/response');

const router = express.Router();

// Apply security headers to all role routes
router.use(securityHeaders);

// GET /v1/roles
router.get('/',
  verifyToken,
  requireScope('roles:read'),
  generalLimiter,
  async (req, res) => {
    try {
      // Return available roles with their scopes
      const roles = Object.keys(ROLES).map(roleKey => ({
        id: ROLES[roleKey],
        name: roleKey.charAt(0) + roleKey.slice(1).toLowerCase(),
        scopes: ROLE_SCOPES[ROLES[roleKey]] || [],
        description: `User with ${roleKey.toLowerCase()} privileges`,
      }));
      
      return success(res, roles);
      
    } catch (err) {
      console.error('Get roles error:', err);
      return error(res, {
        type: '${process.env.NEXT_PUBLIC_API_URL}/errors/internal',
        title: 'Failed to get roles',
        status: 500,
        detail: 'Failed to retrieve available roles',
      });
    }
  }
);

// GET /v1/roles/scopes
router.get('/scopes',
  verifyToken,
  requireScope('roles:read'),
  generalLimiter,
  async (req, res) => {
    try {
      // Return available scopes
      const scopes = Object.keys(SCOPES).map(scopeKey => ({
        id: scopeKey,
        name: scopeKey.replace(':', ' ').replace(/([A-Z])/g, ' $1').trim(),
        description: SCOPES[scopeKey],
      }));
      
      return success(res, scopes);
      
    } catch (err) {
      console.error('Get scopes error:', err);
      return error(res, {
        type: '${process.env.NEXT_PUBLIC_API_URL}/errors/internal',
        title: 'Failed to get scopes',
        status: 500,
        detail: 'Failed to retrieve available scopes',
      });
    }
  }
);

module.exports = router;

