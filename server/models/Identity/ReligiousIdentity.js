const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Identity, IdentitySchema } = require('./Identity');

// Create ReligiousIdentity schema that extends the base Identity schema
const ReligiousIdentitySchema = new Schema({
  // Religious-specific fields can be added here if needed in the future
}, { 
  timestamps: true
});

// Indexes for efficient querying
ReligiousIdentitySchema.index({ parentId: 1, isActive: 1 });

// Virtual for religious children
ReligiousIdentitySchema.virtual('children', {
  ref: 'ReligiousIdentity',
  localField: 'id',
  foreignField: 'parentId'
});

// Virtual for religious parent
ReligiousIdentitySchema.virtual('parent', {
  ref: 'ReligiousIdentity',
  localField: 'parentId',
  foreignField: 'id'
});

// Ensure virtuals are serialized
ReligiousIdentitySchema.set('toJSON', { virtuals: true });
ReligiousIdentitySchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure slug uniqueness
ReligiousIdentitySchema.pre('save', async function(next) {
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
ReligiousIdentitySchema.pre('save', async function(next) {
  if (this.parentId && this.parentId === this.id) {
    const error = new Error('Religious identity cannot be its own parent');
    error.name = 'ValidationError';
    return next(error);
  }
  
  if (this.parentId) {
    const parent = await this.constructor.findOne({ id: this.parentId, isActive: true });
    if (!parent) {
      const error = new Error('Parent religious identity not found');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Create ReligiousIdentity as a discriminator of Identity
// This automatically inherits all Identity fields and creates polymorphic behavior
const ReligiousIdentity = Identity.discriminator('ReligiousIdentity', ReligiousIdentitySchema);

module.exports = ReligiousIdentity;