const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const User = require('../../models/User');
const Media = require('../../models/Media');
const { validate, schemas } = require('../../middleware/validation');
const { verifyToken, requireScope, requireRole, requireOwnership } = require('../../middleware/authorization');
const { generalLimiter, uploadLimiter, securityHeaders } = require('../../middleware/security');
const { success, error, notFound, validationError, forbidden } = require('../../utils/response');
const { paginate, buildPaginationMeta, buildFilter, buildSort, selectFields } = require('../../utils/response');

const router = express.Router();

// Apply security headers to all user routes
router.use(securityHeaders);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/users');
    fs.mkdir(uploadDir, { recursive: true }).then(() => cb(null, uploadDir));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// GET /v1/users
router.get('/',
  verifyToken,
  requireScope('users:read'),
  generalLimiter,
  async (req, res) => {
    try {
      const { page = 1, page_size = 20, filter, sort, fields } = req.query;
      
      // Build query
      let query = User.find({ isActive: true });
      
      // Apply filters
      if (filter) {
        const filterObj = buildFilter(filter);
        query = query.where(filterObj);
      }
      
      // Apply field selection
      const projection = selectFields(fields);
      if (Object.keys(projection).length > 0) {
        query = query.select(projection);
      }
      
      // Apply sorting
      const sortObj = buildSort(sort);
      query = query.sort(sortObj);
      
      // Apply pagination
      const { query: paginatedQuery, pagination } = paginate(query, page, page_size);
      
      // Execute query
      const users = await paginatedQuery;
      const total = await User.countDocuments({ isActive: true });
      
      // Build response
      const meta = buildPaginationMeta(users, total, pagination);
      
      return success(res, users, 200, meta);
      
    } catch (err) {
      console.error('Get users error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get users',
        status: 500,
        detail: 'Failed to retrieve users',
      });
    }
  }
);

// POST /v1/users (admin only)
router.post('/',
  verifyToken,
  requireRole('admin'),
  validate(schemas.userCreate),
  generalLimiter,
  async (req, res) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });
      
      if (existingUser) {
        return validationError(res, {
          email: existingUser.email === email ? ['Email already exists'] : [],
          username: existingUser.username === username ? ['Username already exists'] : [],
        });
      }
      
      // Create user
      const user = new User({
        username,
        email,
        password, // Will be hashed by pre-save middleware
        firstName,
        lastName,
        roles: ['user'],
        isActive: true,
      });
      
      await user.save();
      
      return success(res, {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        isActive: user.isActive,
        createdAt: user.createdAt,
      }, 201);
      
    } catch (err) {
      console.error('Create user error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to create user',
        status: 500,
        detail: 'Failed to create user account',
      });
    }
  }
);

// GET /v1/users/:userId
router.get('/:userId',
  verifyToken,
  requireScope('users:read'),
  generalLimiter,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { fields } = req.query;
      
      // Build query
      let query = User.findById(userId);
      
      // Apply field selection
      const projection = selectFields(fields);
      if (Object.keys(projection).length > 0) {
        query = query.select(projection);
      }
      
      const user = await query;
      
      if (!user) {
        return notFound(res, 'User');
      }
      
      return success(res, {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        location: user.location,
        website: user.website,
        roles: user.roles,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      });
      
    } catch (err) {
      console.error('Get user error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get user',
        status: 500,
        detail: 'Failed to retrieve user information',
      });
    }
  }
);

// PATCH /v1/users/:userId
router.patch('/:userId',
  verifyToken,
  requireOwnership('profile'),
  validate(schemas.userUpdate),
  generalLimiter,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      
      // Remove sensitive fields from update
      delete updateData.password;
      delete updateData.roles;
      delete updateData.isActive;
      
      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return notFound(res, 'User');
      }
      
      return success(res, {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        location: user.location,
        website: user.website,
        roles: user.roles,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      });
      
    } catch (err) {
      console.error('Update user error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to update user',
        status: 500,
        detail: 'Failed to update user information',
      });
    }
  }
);

// DELETE /v1/users/:userId
router.delete('/:userId',
  verifyToken,
  requireOwnership('account'),
  generalLimiter,
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );
      
      if (!user) {
        return notFound(res, 'User');
      }
      
      return success(res, { message: 'User deactivated successfully' });
      
    } catch (err) {
      console.error('Deactivate user error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to deactivate user',
        status: 500,
        detail: 'Failed to deactivate user account',
      });
    }
  }
);

// GET /v1/users/:userId/roles
router.get('/:userId/roles',
  verifyToken,
  requireScope('roles:read'),
  generalLimiter,
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId).select('roles');
      
      if (!user) {
        return notFound(res, 'User');
      }
      
      return success(res, { roles: user.roles });
      
    } catch (err) {
      console.error('Get user roles error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get user roles',
        status: 500,
        detail: 'Failed to retrieve user roles',
      });
    }
  }
);

// PUT /v1/users/:userId/roles
router.put('/:userId/roles',
  verifyToken,
  requireScope('roles:assign'),
  validate(schemas.roleUpdate),
  generalLimiter,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { roles } = req.body;
      
      const user = await User.findByIdAndUpdate(
        userId,
        { roles },
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return notFound(res, 'User');
      }
      
      return success(res, { roles: user.roles });
      
    } catch (err) {
      console.error('Update user roles error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to update user roles',
        status: 500,
        detail: 'Failed to update user roles',
      });
    }
  }
);

// POST /v1/users/:userId/roles
router.post('/:userId/roles',
  verifyToken,
  requireScope('roles:assign'),
  validate(schemas.roleAssignment),
  generalLimiter,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      const user = await User.findById(userId);
      
      if (!user) {
        return notFound(res, 'User');
      }
      
      if (!user.roles.includes(role)) {
        user.roles.push(role);
        await user.save();
      }
      
      return success(res, { roles: user.roles });
      
    } catch (err) {
      console.error('Add user role error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to add user role',
        status: 500,
        detail: 'Failed to add role to user',
      });
    }
  }
);

// DELETE /v1/users/:userId/roles/:role
router.delete('/:userId/roles/:role',
  verifyToken,
  requireScope('roles:assign'),
  generalLimiter,
  async (req, res) => {
    try {
      const { userId, role } = req.params;
      
      const user = await User.findById(userId);
      
      if (!user) {
        return notFound(res, 'User');
      }
      
      user.roles = user.roles.filter(r => r !== role);
      await user.save();
      
      return success(res, { roles: user.roles });
      
    } catch (err) {
      console.error('Remove user role error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to remove user role',
        status: 500,
        detail: 'Failed to remove role from user',
      });
    }
  }
);

// POST /v1/users/:userId/media
router.post('/:userId/media',
  verifyToken,
  requireOwnership('media'),
  uploadLimiter,
  upload.single('file'),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { kind = 'avatar' } = req.body;
      
      if (!req.file) {
        return validationError(res, {
          file: ['File is required']
        });
      }
      
      if (!['avatar', 'banner'].includes(kind)) {
        return validationError(res, {
          kind: ['Kind must be either "avatar" or "banner"']
        });
      }
      
      // Create media record
      const media = new Media({
        entityType: 'user',
        entityId: userId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mediaType: kind,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        url: `/uploads/users/${req.file.filename}`,
        isPrimary: true,
        uploadedBy: req.user.id,
      });
      
      await media.save();
      
      // Set as primary for this user and kind
      await Media.updateMany(
        {
          entityType: 'user',
          entityId: userId,
          mediaType: kind,
          _id: { $ne: media._id }
        },
        { isPrimary: false }
      );
      
      return success(res, {
        id: media._id,
        filename: media.filename,
        originalName: media.originalName,
        mediaType: media.mediaType,
        fileSize: media.fileSize,
        mimeType: media.mimeType,
        url: media.url,
        isPrimary: media.isPrimary,
        createdAt: media.createdAt,
      }, 201);
      
    } catch (err) {
      console.error('Upload user media error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to upload media',
        status: 500,
        detail: 'Failed to upload user media',
      });
    }
  }
);

// GET /v1/users/:userId/media
router.get('/:userId/media',
  verifyToken,
  requireScope('media:read'),
  generalLimiter,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, page_size = 20, mediaType } = req.query;
      
      // Build query
      let query = Media.find({
        entityType: 'user',
        entityId: userId
      });
      
      if (mediaType) {
        query = query.where({ mediaType });
      }
      
      // Apply pagination
      const { query: paginatedQuery, pagination } = paginate(query, page, page_size);
      
      // Execute query
      const media = await paginatedQuery.sort({ createdAt: -1 });
      const total = await Media.countDocuments({
        entityType: 'user',
        entityId: userId,
        ...(mediaType && { mediaType })
      });
      
      // Build response
      const meta = buildPaginationMeta(media, total, pagination);
      
      return success(res, media, 200, meta);
      
    } catch (err) {
      console.error('Get user media error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get user media',
        status: 500,
        detail: 'Failed to retrieve user media',
      });
    }
  }
);

module.exports = router;

