const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware to check if user has admin or developer role
const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user || !user.hasAnyRole(roles)) {
        return res.status(403).json({ 
          message: 'Access denied. Insufficient permissions.' 
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

// GET all available roles
router.get('/available', auth, requireRole(['Developer', 'Admin']), (req, res) => {
  const availableRoles = ['Developer', 'Admin', 'Moderator', 'User'];
  res.json({ roles: availableRoles });
});

// GET users with their roles
router.get('/users', auth, requireRole(['Developer', 'Admin']), async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('username firstName lastName email roles isActive createdAt')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST assign role to user
router.post('/assign', auth, requireRole(['Developer', 'Admin']), async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ 
        message: 'User ID and role are required' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: 'Cannot assign role to inactive user' });
    }

    // Check if role is valid
    const validRoles = ['Developer', 'Admin', 'Moderator', 'User'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Add role if not already present
    if (!user.roles.includes(role)) {
      user.roles.push(role);
      await user.save();
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: `Role '${role}' assigned successfully to ${user.firstName} ${user.lastName}`,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE remove role from user
router.delete('/remove', auth, requireRole(['Developer', 'Admin']), async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ 
        message: 'User ID and role are required' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove role if present
    if (user.roles.includes(role)) {
      user.roles = user.roles.filter(r => r !== role);
      await user.save();
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: `Role '${role}' removed successfully from ${user.firstName} ${user.lastName}`,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update user roles (replace all roles)
router.put('/update/:userId', auth, requireRole(['Developer', 'Admin']), async (req, res) => {
  try {
    const { roles } = req.body;
    const { userId } = req.params;

    if (!Array.isArray(roles)) {
      return res.status(400).json({ message: 'Roles must be an array' });
    }

    // Validate all roles
    const validRoles = ['Developer', 'Admin', 'Moderator', 'User'];
    const invalidRoles = roles.filter(role => !validRoles.includes(role));
    if (invalidRoles.length > 0) {
      return res.status(400).json({ 
        message: `Invalid roles: ${invalidRoles.join(', ')}` 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.roles = roles;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: `Roles updated successfully for ${user.firstName} ${user.lastName}`,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET current user's roles
router.get('/my-roles', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('roles');
    res.json({ roles: user.roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
