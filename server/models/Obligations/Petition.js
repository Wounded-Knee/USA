const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObligationSchema, ObligationSchemaStructure } = require('./Obligation');

/*
This model represents a petition to a government entity.

It is a type of Obligation, so it inherits all the fields from the Obligation model. It adds metadata about the context of the petition and the evidence of the petition, such as the source of the petition, the date of the petition, and it may link to media in the whitepine system. The source of the petition may be social media or website in which case a reference to a specific social media post or deep-linked webpage.

Any metadata which is general enough to be applicable to all forms of obligation should be in the Obligation model. Any metadata which is specific to a petition should be in this model.

*/

const PetitionDispositions = [
    'Supporting', 'Against', 'Neutral'
];

const PetitionSchemaStructure = {
  // Petition-specific fields
  petitionType: {
    type: String,
    enum: ['citizen', 'organization', 'legislative', 'executive', 'other'],
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

const PetitionSchema = new Schema({
  ...ObligationSchemaStructure,
  ...PetitionSchemaStructure
}, {
  timestamps: true
});

// Create Petition as a discriminator of Obligation
// This automatically inherits all Obligation fields and creates polymorphic behavior
const Petition = ObligationSchema.discriminator('Petition', PetitionSchema);

// Export both the model and schema structure
module.exports = { Petition, PetitionSchema, PetitionSchemaStructure, PetitionDispositions };