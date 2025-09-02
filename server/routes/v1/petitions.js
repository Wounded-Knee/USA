const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Petition = require('../../models/Petition');
const Vote = require('../../models/Vote');
const Vigor = require('../../models/Vigor');
const Media = require('../../models/Media');
const metricsWorker = require('../../workers/metrics-worker');
const { validate, schemas } = require('../../middleware/validation');
const { verifyToken, requireScope, requireOwnership, optionalAuth } = require('../../middleware/authorization');
const { generalLimiter, uploadLimiter, securityHeaders } = require('../../middleware/security');
const { success, error, notFound, validationError, conflict } = require('../../utils/response');
const { paginate, buildPaginationMeta, buildFilter, buildSort, selectFields } = require('../../utils/response');

const router = express.Router();

// Apply security headers to all petition routes
router.use(securityHeaders);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/petitions');
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
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  }
});

// GET /v1/petitions
router.get('/',
  optionalAuth,
  generalLimiter,
  async (req, res) => {
    try {
      const { 
        page = 1, 
        page_size = 20, 
        filter, 
        sort, 
        fields,
        category,
        active,
        creator,
        jurisdictionId,
        governingBodyId,
        legislationId
      } = req.query;
      
      // Build query
      let query = Petition.find({ isActive: true });
      
      // Apply filters
      if (filter) {
        const filterObj = buildFilter(filter);
        query = query.where(filterObj);
      }
      
      // Apply specific filters
      if (category) query = query.where({ categoryId: category });
      if (active !== undefined) query = query.where({ status: active === 'true' ? 'active' : 'draft' });
      if (creator) query = query.where({ creator });
      if (jurisdictionId) query = query.where({ jurisdiction: jurisdictionId });
      if (governingBodyId) query = query.where({ governingBody: governingBodyId });
      if (legislationId) query = query.where({ legislation: legislationId });
      
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
      
      // Populate related fields
      const populatedQuery = paginatedQuery
        .populate('creator', 'username firstName lastName')
        .populate('jurisdiction', 'name slug level')
        .populate('governingBody', 'name slug')
        .populate('legislation', 'title bill_number');
      
      // Execute query
      const petitions = await populatedQuery;
      const total = await Petition.countDocuments({ isActive: true });
      
      // Build response
      const meta = buildPaginationMeta(petitions, total, pagination);
      
      return success(res, petitions, 200, meta);
      
    } catch (err) {
      console.error('Get petitions error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get petitions',
        status: 500,
        detail: 'Failed to retrieve petitions',
      });
    }
  }
);

// POST /v1/petitions
router.post('/',
  verifyToken,
  requireScope('petitions:write'),
  validate(schemas.petitionCreate),
  generalLimiter,
  async (req, res) => {
    try {
      const { title, description, category, jurisdictionId, governingBodyId, legislationId } = req.body;
      
      const petition = new Petition({
        title,
        description,
        categoryId: category,
        jurisdiction: jurisdictionId,
        governingBody: governingBodyId,
        legislation: legislationId,
        creator: req.user.id,
        status: 'active',
      });
      
      await petition.save();
      
      // Populate related fields
      await petition.populate([
        { path: 'creator', select: 'username firstName lastName' },
        { path: 'jurisdiction', select: 'name slug level' },
        { path: 'governingBody', select: 'name slug' },
        { path: 'legislation', select: 'title bill_number' }
      ]);
      
      return success(res, petition, 201);
      
    } catch (err) {
      console.error('Create petition error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to create petition',
        status: 500,
        detail: 'Failed to create petition',
      });
    }
  }
);

// GET /v1/petitions/:petitionId
router.get('/:petitionId',
  optionalAuth,
  generalLimiter,
  async (req, res) => {
    try {
      const { petitionId } = req.params;
      const { fields } = req.query;
      
      // Build query
      let query = Petition.findById(petitionId);
      
      // Apply field selection
      const projection = selectFields(fields);
      if (Object.keys(projection).length > 0) {
        query = query.select(projection);
      }
      
      // Populate related fields
      const populatedQuery = query
        .populate('creator', 'username firstName lastName')
        .populate('jurisdiction', 'name slug level')
        .populate('governingBody', 'name slug')
        .populate('legislation', 'title bill_number');
      
      const petition = await populatedQuery;
      
      if (!petition) {
        return notFound(res, 'Petition');
      }
      
      return success(res, petition);
      
    } catch (err) {
      console.error('Get petition error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get petition',
        status: 500,
        detail: 'Failed to retrieve petition',
      });
    }
  }
);

// PATCH /v1/petitions/:petitionId
router.patch('/:petitionId',
  verifyToken,
  requireOwnership('petition'),
  validate(schemas.petitionUpdate),
  generalLimiter,
  async (req, res) => {
    try {
      const { petitionId } = req.params;
      const updateData = req.body;
      
      const petition = await Petition.findByIdAndUpdate(
        petitionId,
        updateData,
        { new: true, runValidators: true }
      ).populate([
        { path: 'creator', select: 'username firstName lastName' },
        { path: 'jurisdiction', select: 'name slug level' },
        { path: 'governingBody', select: 'name slug' },
        { path: 'legislation', select: 'title bill_number' }
      ]);
      
      if (!petition) {
        return notFound(res, 'Petition');
      }
      
      return success(res, petition);
      
    } catch (err) {
      console.error('Update petition error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to update petition',
        status: 500,
        detail: 'Failed to update petition',
      });
    }
  }
);

// DELETE /v1/petitions/:petitionId
router.delete('/:petitionId',
  verifyToken,
  requireOwnership('petition'),
  generalLimiter,
  async (req, res) => {
    try {
      const { petitionId } = req.params;
      
      const petition = await Petition.findByIdAndUpdate(
        petitionId,
        { isActive: false },
        { new: true }
      );
      
      if (!petition) {
        return notFound(res, 'Petition');
      }
      
      return success(res, { message: 'Petition deleted successfully' });
      
    } catch (err) {
      console.error('Delete petition error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to delete petition',
        status: 500,
        detail: 'Failed to delete petition',
      });
    }
  }
);

// GET /v1/petitions/:petitionId/votes
router.get('/:petitionId/votes',
  optionalAuth,
  generalLimiter,
  async (req, res) => {
    try {
      const { petitionId } = req.params;
      const { page = 1, page_size = 20, userId } = req.query;
      
      // Build query
      let query = Vote.find({ petition: petitionId });
      
      if (userId) {
        query = query.where({ user: userId });
      }
      
      // Apply pagination
      const { query: paginatedQuery, pagination } = paginate(query, page, page_size);
      
      // Populate user info
      const populatedQuery = paginatedQuery.populate('user', 'username firstName lastName');
      
      // Execute query
      const votes = await populatedQuery.sort({ createdAt: -1 });
      const total = await Vote.countDocuments({ petition: petitionId });
      
      // Build response
      const meta = buildPaginationMeta(votes, total, pagination);
      
      return success(res, votes, 200, meta);
      
    } catch (err) {
      console.error('Get petition votes error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get petition votes',
        status: 500,
        detail: 'Failed to retrieve petition votes',
      });
    }
  }
);

// POST /v1/petitions/:petitionId/votes
router.post('/:petitionId/votes',
  verifyToken,
  requireScope('votes:write'),
  validate(schemas.voteCreate),
  generalLimiter,
  async (req, res) => {
    try {
      const { petitionId } = req.params;
      
      // Check if user already voted
      const existingVote = await Vote.findOne({
        user: req.user.id,
        petition: petitionId
      });
      
      if (existingVote) {
        return conflict(res, 'User already voted on this petition', existingVote._id);
      }
      
      // Create vote
      const vote = new Vote({
        user: req.user.id,
        petition: petitionId,
      });
      
      await vote.save();
      
      // Update petition metrics
      metricsWorker.queueUpdate(petitionId);
      
      return success(res, {
        id: vote._id,
        petitionId: vote.petition,
        userId: vote.user,
        createdAt: vote.createdAt,
      }, 201);
      
    } catch (err) {
      console.error('Create vote error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to create vote',
        status: 500,
        detail: 'Failed to create vote',
      });
    }
  }
);

// GET /v1/petitions/:petitionId/votes/:voteId
router.get('/:petitionId/votes/:voteId',
  optionalAuth,
  generalLimiter,
  async (req, res) => {
    try {
      const { voteId } = req.params;
      
      const vote = await Vote.findById(voteId)
        .populate('user', 'username firstName lastName')
        .populate('petition', 'title');
      
      if (!vote) {
        return notFound(res, 'Vote');
      }
      
      return success(res, vote);
      
    } catch (err) {
      console.error('Get vote error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get vote',
        status: 500,
        detail: 'Failed to retrieve vote',
      });
    }
  }
);

// GET /v1/petitions/:petitionId/vigor
router.get('/:petitionId/vigor',
  optionalAuth,
  generalLimiter,
  async (req, res) => {
    try {
      const { petitionId } = req.params;
      const { page = 1, page_size = 20 } = req.query;
      
      // Get votes for this petition
      const votes = await Vote.find({ petition: petitionId, isActive: true });
      const voteIds = votes.map(v => v._id);
      
      if (voteIds.length === 0) {
        return success(res, [], 200, buildPaginationMeta([], 0, { page, page_size }));
      }
      
      // Build query for vigor linked to these votes
      let query = Vigor.find({ vote: { $in: voteIds } });
      
      // Apply pagination
      const { query: paginatedQuery, pagination } = paginate(query, page, page_size);
      
      // Populate user info and vote info
      const populatedQuery = paginatedQuery.populate('user', 'username firstName lastName');
      
      // Execute query
      const vigor = await populatedQuery.sort({ createdAt: -1 });
      const total = await Vigor.countDocuments({ vote: { $in: voteIds } });
      
      // Calculate totals
      const totalVigor = await Vigor.aggregate([
        { $match: { vote: { $in: voteIds } } },
        { $group: { _id: null, total: { $sum: '$vigorAmount' } } }
      ]);
      
      // Build response
      const meta = buildPaginationMeta(vigor, total, pagination);
      meta.totalVigor = totalVigor[0]?.total || 0;
      
      return success(res, vigor, 200, meta);
      
    } catch (err) {
      console.error('Get petition vigor error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get petition vigor',
        status: 500,
        detail: 'Failed to retrieve petition vigor',
      });
    }
  }
);

// POST /v1/petitions/:petitionId/vigor
router.post('/:petitionId/vigor',
  verifyToken,
  requireScope('vigor:write'),
  validate(schemas.vigorCreate),
  generalLimiter,
  async (req, res) => {
    try {
      const { petitionId } = req.params;
      const { voteId, type, amount, activityData, signingStatement } = req.body;
      
      // Verify user has voted on this petition
      const userVote = await Vote.findOne({
        user: req.user.id,
        petition: petitionId,
        isActive: true
      });
      
      if (!userVote) {
        return error(res, {
          type: 'https://api.example.com/errors/forbidden',
          title: 'Vote required',
          status: 403,
          detail: 'You must vote on a petition before contributing vigor',
        });
      }
      
      // Create vigor contribution
      const vigor = new Vigor({
        user: req.user.id,
        vote: userVote._id,
        vigorType: type,
        vigorAmount: amount,
        activity: activityData,
        signingStatement,
      });
      
      await vigor.save();
      
      // Update petition metrics
      metricsWorker.queueUpdate(petitionId);
      
      return success(res, {
        id: vigor._id,
        userId: vigor.user,
        voteId: vigor.vote,
        vigorType: vigor.vigorType,
        vigorAmount: vigor.vigorAmount,
        createdAt: vigor.createdAt,
      }, 201);
      
    } catch (err) {
      console.error('Create vigor error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to create vigor',
        status: 500,
        detail: 'Failed to create vigor contribution',
      });
    }
  }
);

// GET /v1/petitions/:petitionId/media
router.get('/:petitionId/media',
  optionalAuth,
  generalLimiter,
  async (req, res) => {
    try {
      const { petitionId } = req.params;
      const { page = 1, page_size = 20, mediaType } = req.query;
      
      // Build query
      let query = Media.find({
        entityType: 'petition',
        entityId: petitionId
      });
      
      if (mediaType) {
        query = query.where({ mediaType });
      }
      
      // Apply pagination
      const { query: paginatedQuery, pagination } = paginate(query, page, page_size);
      
      // Execute query
      const media = await paginatedQuery.sort({ createdAt: -1 });
      const total = await Media.countDocuments({
        entityType: 'petition',
        entityId: petitionId,
        ...(mediaType && { mediaType })
      });
      
      // Build response
      const meta = buildPaginationMeta(media, total, pagination);
      
      return success(res, media, 200, meta);
      
    } catch (err) {
      console.error('Get petition media error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to get petition media',
        status: 500,
        detail: 'Failed to retrieve petition media',
      });
    }
  }
);

// POST /v1/petitions/:petitionId/media
router.post('/:petitionId/media',
  verifyToken,
  requireOwnership('petition'),
  uploadLimiter,
  upload.single('file'),
  async (req, res) => {
    try {
      const { petitionId } = req.params;
      const { description, isPrimary = false } = req.body;
      
      if (!req.file) {
        return validationError(res, {
          file: ['File is required']
        });
      }
      
      // Create media record
      const media = new Media({
        entityType: 'petition',
        entityId: petitionId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mediaType: 'document',
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        url: `/uploads/petitions/${req.file.filename}`,
        description,
        isPrimary,
        uploadedBy: req.user.id,
      });
      
      await media.save();
      
      // Set as primary if requested
      if (isPrimary) {
        await Media.updateMany(
          {
            entityType: 'petition',
            entityId: petitionId,
            _id: { $ne: media._id }
          },
          { isPrimary: false }
        );
      }
      
      return success(res, {
        id: media._id,
        filename: media.filename,
        originalName: media.originalName,
        mediaType: media.mediaType,
        fileSize: media.fileSize,
        mimeType: media.mimeType,
        url: media.url,
        description: media.description,
        isPrimary: media.isPrimary,
        createdAt: media.createdAt,
      }, 201);
      
    } catch (err) {
      console.error('Upload petition media error:', err);
      return error(res, {
        type: 'https://api.example.com/errors/internal',
        title: 'Failed to upload media',
        status: 500,
        detail: 'Failed to upload petition media',
      });
    }
  }
);

module.exports = router;

