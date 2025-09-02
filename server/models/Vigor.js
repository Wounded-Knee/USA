const mongoose = require('mongoose');
const { Schema } = mongoose;

const Vigor = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  vote: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vote', 
    required: true, 
    index: true 
  },
  vigorType: { 
    type: String, 
    enum: ['steps', 'calories', 'duration', 'distance', 'workout', 'meditation', 'reading', 'volunteering'], 
    required: true, 
    index: true 
  },
  vigorAmount: { 
    type: Number, 
    min: 0, 
    required: true 
  },
  activity: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  signingStatement: { 
    type: String, 
    maxlength: 1000 
  },
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  }
}, { 
  timestamps: true 
});

// Indexes for common queries
Vigor.index({ vote: 1, createdAt: -1 });
Vigor.index({ user: 1, createdAt: -1 });
Vigor.index({ vigorType: 1, createdAt: -1 });
Vigor.index({ isActive: 1, createdAt: -1 });

// Guardrails: ensure vigor.user matches vote.user
Vigor.pre('validate', async function(next) {
  if (!this.vote || !this.user) {
    return next(new Error('vote and user are required'));
  }
  
  try {
    const vote = await this.model('Vote').findById(this.vote).select('user').lean();
    if (!vote) {
      return next(new Error('vote not found'));
    }
    
    if (vote.user.toString() !== this.user.toString()) {
      return next(new Error('vigor.user must match vote.user'));
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Vigor', Vigor);
