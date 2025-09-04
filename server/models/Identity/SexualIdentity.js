const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Identity, IdentitySchema } = require('./Identity');

// Create SexualIdentity schema that extends the base Identity schema
const SexualIdentitySchema = new Schema({  
  // Sexual-specific fields can be added here if needed in the future
}, { 
  timestamps: true
});

// Indexes for efficient querying
SexualIdentitySchema.index({ parentId: 1, isActive: 1 });

// Virtual for sexual children
SexualIdentitySchema.virtual('children', {
  ref: 'SexualIdentity',
  localField: 'id',
  foreignField: 'parentId'
});

// Virtual for sexual parent
SexualIdentitySchema.virtual('parent', {
  ref: 'SexualIdentity',
  localField: 'parentId',
  foreignField: 'id'
});

// Ensure virtuals are serialized
SexualIdentitySchema.set('toJSON', { virtuals: true });
SexualIdentitySchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure slug uniqueness
SexualIdentitySchema.pre('save', async function(next) {
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
SexualIdentitySchema.pre('save', async function(next) {
  if (this.parentId && this.parentId === this.id) {
    const error = new Error('Sexual identity cannot be its own parent');
    error.name = 'ValidationError';
    return next(error);
  }
  
  if (this.parentId) {
    const parent = await this.constructor.findOne({ id: this.parentId, isActive: true });
    if (!parent) {
      const error = new Error('Parent sexual identity not found');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Create SexualIdentity as a discriminator of Identity
// This automatically inherits all Identity fields and creates polymorphic behavior
const SexualIdentity = Identity.discriminator('SexualIdentity', SexualIdentitySchema);

module.exports = SexualIdentity;
