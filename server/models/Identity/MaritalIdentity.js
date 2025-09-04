const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Identity, IdentitySchema } = require('./Identity');

// Create MaritalIdentity schema that extends the base Identity schema
const MaritalIdentitySchema = new Schema({  
  // Marital-specific fields can be added here if needed in the future
}, { 
  timestamps: true
});

// Indexes for efficient querying
MaritalIdentitySchema.index({ parentId: 1, isActive: 1 });

// Virtual for marital children
MaritalIdentitySchema.virtual('children', {
  ref: 'MaritalIdentity',
  localField: 'id',
  foreignField: 'parentId'
});

// Virtual for marital parent
MaritalIdentitySchema.virtual('parent', {
  ref: 'MaritalIdentity',
  localField: 'parentId',
  foreignField: 'id'
});

// Ensure virtuals are serialized
MaritalIdentitySchema.set('toJSON', { virtuals: true });
MaritalIdentitySchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure slug uniqueness
MaritalIdentitySchema.pre('save', async function(next) {
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
MaritalIdentitySchema.pre('save', async function(next) {
  if (this.parentId && this.parentId === this.id) {
    const error = new Error('Marital identity cannot be its own parent');
    error.name = 'ValidationError';
    return next(error);
  }
  
  if (this.parentId) {
    const parent = await this.constructor.findOne({ id: this.parentId, isActive: true });
    if (!parent) {
      const error = new Error('Parent marital identity not found');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Create MaritalIdentity as a discriminator of Identity
// This automatically inherits all Identity fields and creates polymorphic behavior
const MaritalIdentity = Identity.discriminator('MaritalIdentity', MaritalIdentitySchema);

module.exports = MaritalIdentity;
