const fs = require('fs').promises;
const path = require('path');
const { Media, Jurisdiction, GoverningBody, Office, Position } = require('../models/Government');

// Media upload directory
const UPLOAD_DIR = path.join(__dirname, '../uploads/media');
const PUBLIC_URL_BASE = '/uploads/media';

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

// Generate unique filename
const generateFilename = (originalName, mediaType) => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${mediaType}_${timestamp}_${random}${ext}`;
};

// Validate file type
const validateFileType = (mimeType, mediaType) => {
  const allowedTypes = {
    seal: ['image/jpeg', 'image/png', 'image/svg+xml'],
    flag: ['image/jpeg', 'image/png', 'image/svg+xml'],
    headshot: ['image/jpeg', 'image/png'],
    logo: ['image/jpeg', 'image/png', 'image/svg+xml'],
    building: ['image/jpeg', 'image/png'],
    document: ['application/pdf', 'image/jpeg', 'image/png'],
    signature: ['image/jpeg', 'image/png', 'image/svg+xml'],
    other: ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf']
  };

  return allowedTypes[mediaType]?.includes(mimeType) || false;
};

// Get image dimensions
const getImageDimensions = async (filePath) => {
  try {
    const sharp = require('sharp');
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.warn('Could not get image dimensions:', error.message);
    return { width: null, height: null };
  }
};

// Upload media file
const uploadMedia = async (file, mediaData, uploadedBy) => {
  await ensureUploadDir();

  const { media_type, title, description, alt_text, entity_type, entity_id } = mediaData;

  // Validate file type
  if (!validateFileType(file.mimetype, media_type)) {
    throw new Error(`Invalid file type for ${media_type}. Allowed types: ${allowedTypes[media_type]?.join(', ')}`);
  }

  // Generate filename and paths
  const filename = generateFilename(file.originalname, media_type);
  const filePath = path.join(UPLOAD_DIR, filename);
  const publicUrl = `${PUBLIC_URL_BASE}/${filename}`;

  // Save file
  await fs.writeFile(filePath, file.buffer);

  // Get image dimensions if applicable
  let dimensions = {};
  if (file.mimetype.startsWith('image/')) {
    dimensions = await getImageDimensions(filePath);
  }

  // Create media record
  const mediaRecord = {
    filename,
    original_name: file.originalname,
    mime_type: file.mimetype,
    size: file.size,
    path: filePath,
    url: publicUrl,
    media_type,
    title,
    description,
    alt_text,
    width: dimensions.width,
    height: dimensions.height,
    uploaded_by: uploadedBy
  };

  // Set entity reference based on entity_type
  switch (entity_type) {
    case 'jurisdiction':
      mediaRecord.jurisdiction = entity_id;
      break;
    case 'governing_body':
      mediaRecord.governing_body = entity_id;
      break;
    case 'office':
      mediaRecord.office = entity_id;
      break;
    case 'position':
      mediaRecord.position = entity_id;
      break;
  }

  const media = new Media(mediaRecord);
  await media.save();

  // Update entity's media array
  await updateEntityMedia(entity_type, entity_id, media._id);

  return media;
};

// Update entity's media array
const updateEntityMedia = async (entityType, entityId, mediaId) => {
  const updateField = `${entityType === 'governing_body' ? 'governing_body' : entityType}`;
  
  const Model = {
    jurisdiction: Jurisdiction,
    governing_body: GoverningBody,
    office: Office,
    position: Position
  }[entityType];

  if (!Model) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  await Model.findByIdAndUpdate(entityId, {
    $addToSet: { media: mediaId }
  });
};

// Remove media from entity
const removeMediaFromEntity = async (entityType, entityId, mediaId) => {
  const updateField = `${entityType === 'governing_body' ? 'governing_body' : entityType}`;
  
  const Model = {
    jurisdiction: Jurisdiction,
    governing_body: GoverningBody,
    office: Office,
    position: Position
  }[entityType];

  if (!Model) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  await Model.findByIdAndUpdate(entityId, {
    $pull: { media: mediaId }
  });

  // Clear primary_media if it was this media
  await Model.findByIdAndUpdate(entityId, {
    $unset: { primary_media: mediaId }
  });
};

// Set primary media for entity
const setPrimaryMedia = async (entityType, entityId, mediaId) => {
  const Model = {
    jurisdiction: Jurisdiction,
    governing_body: GoverningBody,
    office: Office,
    position: Position
  }[entityType];

  if (!Model) {
    throw new Error(`Invalid entity type: ${entityType}`);
  }

  // First, unset any existing primary media
  await Model.findByIdAndUpdate(entityId, {
    $unset: { primary_media: 1 }
  });

  // Set new primary media
  await Model.findByIdAndUpdate(entityId, {
    primary_media: mediaId
  });

  // Update media record
  await Media.findByIdAndUpdate(mediaId, { is_primary: true });
};

// Delete media file and record
const deleteMedia = async (mediaId) => {
  const media = await Media.findById(mediaId);
  if (!media) {
    throw new Error('Media not found');
  }

  // Delete file from filesystem
  try {
    await fs.unlink(media.path);
  } catch (error) {
    console.warn('Could not delete file:', error.message);
  }

  // Remove from all entity references
  if (media.jurisdiction) {
    await removeMediaFromEntity('jurisdiction', media.jurisdiction, mediaId);
  }
  if (media.governing_body) {
    await removeMediaFromEntity('governing_body', media.governing_body, mediaId);
  }
  if (media.office) {
    await removeMediaFromEntity('office', media.office, mediaId);
  }
  if (media.position) {
    await removeMediaFromEntity('position', media.position, mediaId);
  }

  // Delete media record
  await Media.findByIdAndDelete(mediaId);

  return media;
};

// Get media for entity
const getEntityMedia = async (entityType, entityId, mediaType = null) => {
  const query = {};
  
  switch (entityType) {
    case 'jurisdiction':
      query.jurisdiction = entityId;
      break;
    case 'governing_body':
      query.governing_body = entityId;
      break;
    case 'office':
      query.office = entityId;
      break;
    case 'position':
      query.position = entityId;
      break;
    default:
      throw new Error(`Invalid entity type: ${entityType}`);
  }

  if (mediaType) {
    query.media_type = mediaType;
  }

  return await Media.find(query).populate('uploaded_by', 'username firstName lastName');
};

// Validate media data
const validateMediaData = (data) => {
  const errors = [];

  if (!data.media_type) {
    errors.push('Media type is required');
  }

  if (!data.entity_type) {
    errors.push('Entity type is required');
  }

  if (!data.entity_id) {
    errors.push('Entity ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  uploadMedia,
  deleteMedia,
  setPrimaryMedia,
  getEntityMedia,
  validateMediaData,
  ensureUploadDir,
  UPLOAD_DIR,
  PUBLIC_URL_BASE
};
