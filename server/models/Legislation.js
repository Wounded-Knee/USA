const mongoose = require('mongoose');
const { Schema } = mongoose;

const Legislation = new Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  bill_number: { 
    type: String, 
    required: true, 
    trim: true 
  },
  governing_body: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'GoverningBody', 
    required: true, 
    index: true 
  },
  status: { 
    type: String, 
    enum: ['introduced', 'in_committee', 'passed_committee', 'passed_chamber', 'passed_both', 'signed', 'vetoed', 'failed'], 
    required: true, 
    index: true 
  },
  introduced_date: { 
    type: Date, 
    required: true, 
    index: true 
  },
  summary: { 
    type: String, 
    maxlength: 2000 
  },
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  }
}, { 
  timestamps: true 
});

// Unique index: bill number unique within governing body
Legislation.index({ governing_body: 1, bill_number: 1 }, { unique: true });

// Additional indexes for common queries
Legislation.index({ status: 1, introduced_date: -1 });
Legislation.index({ governing_body: 1, status: 1 });
Legislation.index({ isActive: 1, introduced_date: -1 });

module.exports = mongoose.model('Legislation', Legislation);
