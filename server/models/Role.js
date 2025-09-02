const mongoose = require('mongoose');
const { Schema } = mongoose;

const Role = new Schema({
  name: { 
    type: String, 
    unique: true, 
    required: true 
  },
  scopes: [{ 
    type: String, 
    required: true 
  }],
  description: { 
    type: String, 
    maxlength: 500 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Index for common queries
Role.index({ isActive: 1, name: 1 });

module.exports = mongoose.model('Role', Role);
