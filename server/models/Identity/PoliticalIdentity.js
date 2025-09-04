const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Identity, IdentitySchema } = require('./Identity');

// Create PoliticalIdentity schema that extends the base Identity schema
const PoliticalIdentitySchema = new Schema({  
  // Political-specific fields can be added here if needed in the future
  color: { 
    type: String, 
    required: true, 
    maxlength: 7, 
    validate: {
      validator: function(v) {
        return /^#[0-9A-F]{6}$/i.test(v);
      },
      message: 'Color must be a valid hex color code'
    }
  }
}, { 
  timestamps: true
});

// Indexes for efficient querying
PoliticalIdentitySchema.index({ parentId: 1, isActive: 1 });

// Virtual for political children
PoliticalIdentitySchema.virtual('children', {
  ref: 'PoliticalIdentity',
  localField: 'id',
  foreignField: 'parentId'
});

// Virtual for political parent
PoliticalIdentitySchema.virtual('parent', {
  ref: 'PoliticalIdentity',
  localField: 'parentId',
  foreignField: 'id'
});

// Ensure virtuals are serialized
PoliticalIdentitySchema.set('toJSON', { virtuals: true });
PoliticalIdentitySchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure slug uniqueness
PoliticalIdentitySchema.pre('save', async function(next) {
  if (this.isModified('slug')) {
    const existing = await this.constructor.findOne({ 
      slug: this.slug, 
      _id: { $ne: this._id } 
    });
    if (existing) {
      const error = new Error('Slug must be unique');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Pre-save middleware to validate parent-child relationships
PoliticalIdentitySchema.pre('save', async function(next) {
  if (this.parentId && this.parentId === this.id) {
    const error = new Error('Political identity cannot be its own parent');
    error.name = 'ValidationError';
    return next(error);
  }
  
  if (this.parentId) {
    const parent = await this.constructor.findOne({ id: this.parentId, isActive: true });
    if (!parent) {
      const error = new Error('Parent political identity not found');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Create PoliticalIdentity as a discriminator of Identity
// This automatically inherits all Identity fields and creates polymorphic behavior
const PoliticalIdentity = Identity.discriminator('PoliticalIdentity', PoliticalIdentitySchema);

module.exports = PoliticalIdentity;
