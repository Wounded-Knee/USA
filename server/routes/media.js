const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Types } = require('mongoose');

const { Media } = require('../models/Government');
const {
  uploadMedia,
  deleteMedia,
  setPrimaryMedia,
  getEntityMedia,
  validateMediaData,
  ensureUploadDir
} = require('../utils/mediaUtils');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Basic file type validation
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, SVG, and PDF files are allowed.'), false);
    }
  }
});

// ------------------------------
// Media Routes
// ------------------------------

// Get all media (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { 
      entity_type, 
      entity_id, 
      media_type, 
      limit = 50, 
      skip = 0,
      sort = '-createdAt'
    } = req.query;

    const query = {};

    if (entity_type && entity_id) {
      query[entity_type] = entity_id;
    }

    if (media_type) {
      query.media_type = media_type;
    }

    const media = await Media.find(query)
      .populate('uploaded_by', 'username firstName lastName')
      .populate('jurisdiction', 'name slug')
      .populate('governing_body', 'name slug')
      .populate('office', 'name slug')
      .populate('position', 'office person')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Media.countDocuments(query);

    res.json({
      media,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get media by ID
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('uploaded_by', 'username firstName lastName')
      .populate('jurisdiction', 'name slug')
      .populate('governing_body', 'name slug')
      .populate('office', 'name slug')
      .populate('position', 'office person');

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json({ media });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload new media
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate media data
    const validation = validateMediaData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: 'Invalid media data', details: validation.errors });
    }

    // Get user from request (assuming authentication middleware sets req.user)
    const uploadedBy = req.user?._id || req.body.uploaded_by;
    if (!uploadedBy) {
      return res.status(400).json({ error: 'Uploader information is required' });
    }

    const media = await uploadMedia(req.file, req.body, uploadedBy);

    res.status(201).json({
      message: 'Media uploaded successfully',
      media
    });
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update media metadata
router.put('/:id', async (req, res) => {
  try {
    const { title, description, alt_text, is_public } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (alt_text !== undefined) updateData.alt_text = alt_text;
    if (is_public !== undefined) updateData.is_public = is_public;

    const media = await Media.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('uploaded_by', 'username firstName lastName');

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json({
      message: 'Media updated successfully',
      media
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set primary media for entity
router.put('/:id/set-primary', async (req, res) => {
  try {
    const { entity_type, entity_id } = req.body;

    if (!entity_type || !entity_id) {
      return res.status(400).json({ error: 'Entity type and entity ID are required' });
    }

    await setPrimaryMedia(entity_type, entity_id, req.params.id);

    res.json({
      message: 'Primary media set successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete media
router.delete('/:id', async (req, res) => {
  try {
    const media = await deleteMedia(req.params.id);

    res.json({
      message: 'Media deleted successfully',
      media
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get media for specific entity
router.get('/entity/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { media_type } = req.query;

    if (!Types.ObjectId.isValid(entityId)) {
      return res.status(400).json({ error: 'Invalid entity ID' });
    }

    const media = await getEntityMedia(entityType, entityId, media_type);

    res.json({
      media,
      entity_type: entityType,
      entity_id: entityId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Link existing media to entity
router.post('/link', async (req, res) => {
  try {
    const { media_id, entity_type, entity_id } = req.body;

    if (!media_id || !entity_type || !entity_id) {
      return res.status(400).json({ error: 'Media ID, entity type, and entity ID are required' });
    }

    if (!Types.ObjectId.isValid(media_id) || !Types.ObjectId.isValid(entity_id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Update media record
    const updateData = {};
    updateData[entity_type] = entity_id;

    const media = await Media.findByIdAndUpdate(
      media_id,
      updateData,
      { new: true }
    ).populate('uploaded_by', 'username firstName lastName');

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Update entity's media array
    const { updateEntityMedia } = require('../utils/mediaUtils');
    await updateEntityMedia(entity_type, entity_id, media_id);

    res.json({
      message: 'Media linked successfully',
      media
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlink media from entity
router.post('/unlink', async (req, res) => {
  try {
    const { media_id, entity_type, entity_id } = req.body;

    if (!media_id || !entity_type || !entity_id) {
      return res.status(400).json({ error: 'Media ID, entity type, and entity ID are required' });
    }

    if (!Types.ObjectId.isValid(media_id) || !Types.ObjectId.isValid(entity_id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Remove from entity's media array
    const { removeMediaFromEntity } = require('../utils/mediaUtils');
    await removeMediaFromEntity(entity_type, entity_id, media_id);

    // Clear entity reference from media
    const updateData = {};
    updateData[entity_type] = null;

    const media = await Media.findByIdAndUpdate(
      media_id,
      updateData,
      { new: true }
    ).populate('uploaded_by', 'username firstName lastName');

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json({
      message: 'Media unlinked successfully',
      media
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
