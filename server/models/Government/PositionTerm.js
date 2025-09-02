const mongoose = require('mongoose');
const { Schema } = mongoose;

const PositionTerm = new Schema({
  position: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Position', 
    required: true, 
    index: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  }, // the office holder
  startDate: { 
    type: Date, 
    required: true, 
    index: true 
  },
  endDate: { 
    type: Date 
  }, // null means current
  isCurrent: { 
    type: Boolean, 
    default: true, 
    index: true 
  }
}, { 
  timestamps: true 
});

// Indexes for common queries
PositionTerm.index({ position: 1, startDate: -1 });
PositionTerm.index({ position: 1, isCurrent: 1 }, { partialFilterExpression: { isCurrent: true } });
PositionTerm.index({ user: 1, isCurrent: 1 });
PositionTerm.index({ startDate: -1, isCurrent: 1 });

// Validation: prevent overlapping terms for the same position
PositionTerm.pre('save', async function(next) {
  if (this.isNew || this.isModified('startDate') || this.isModified('endDate') || this.isModified('position')) {
    const q = {
      position: this.position,
      _id: { $ne: this._id },
      $or: [
        { 
          endDate: null, 
          startDate: { $lte: this.endDate || new Date('9999-12-31') } 
        },
        { 
          endDate: { $gte: this.startDate } 
        }
      ]
    };
    
    const overlap = await this.model('PositionTerm').exists(q);
    if (overlap) {
      return next(new Error('Overlapping terms for position'));
    }
  }
  next();
});

module.exports = mongoose.model('PositionTerm', PositionTerm);
