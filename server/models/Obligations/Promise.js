const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObligationSchema, ObligationSchemaStructure } = require('./Obligation');

/*
This model represents a promise made by a government entity to a citizen.

It might be a campaign promise, a policy promise, a policy commitment, or a policy intention. It is a commitment to a specific action by a government entity to a citizen or population. A promise is a type of Obligation, so it inherits all the fields from the Obligation model. It adds metadata about the context of the promise and the evidence of the promise, such as the source of the promise, the date of the promise, and it may link to media in the whitepine system. The source of the promise may be social media or website in which case a reference to a specific social media post or deep-linked webpage.

Any metadata which is general enough to be applicable to all forms of obligation should be in the Obligation model. Any metadata which is specific to a promise should be in this model.

*/

const PromiseDispositions = [
    'Kept', 'Partially Kept', 'Broken', 'No Action Taken'
];

const PromiseSchemaStructure = {
  // Promise-specific fields
  promiseType: {
    type: String,
    enum: ['campaign', 'policy', 'commitment', 'intention', 'legislative', 'executive', 'other'],
    required: true,
    index: true
  },
  
  // Evidence - now references the comprehensive Evidence model
  evidence: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evidence'
  }],
  
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true
  }
};

const PromiseSchema = new Schema({
  ...ObligationSchemaStructure,
  ...PromiseSchemaStructure
}, {
  timestamps: true
});

// Create Promise as a discriminator of Obligation
// This automatically inherits all Obligation fields and creates polymorphic behavior
const Promise = ObligationSchema.discriminator('Promise', PromiseSchema);

// Export both the model and schema structure
module.exports = { Promise, PromiseSchema, PromiseSchemaStructure, PromiseDispositions };