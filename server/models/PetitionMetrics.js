const mongoose = require('mongoose');
const { Schema } = mongoose;

const PetitionMetrics = new Schema({
  petitionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Petition', 
    unique: true, 
    index: true 
  },
  voteCount: { 
    type: Number, 
    default: 0 
  },
  vigorCount: { 
    type: Number, 
    default: 0 
  },
  totalVigor: { 
    type: Number, 
    default: 0 
  },
  trendingScore: { 
    type: Number, 
    default: 0 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now, 
    index: true 
  }
}, { 
  versionKey: false 
});

// Indexes for analytics queries
PetitionMetrics.index({ voteCount: -1 });
PetitionMetrics.index({ totalVigor: -1 });
PetitionMetrics.index({ trendingScore: -1 });
PetitionMetrics.index({ updatedAt: -1 });

module.exports = mongoose.model('PetitionMetrics', PetitionMetrics);
