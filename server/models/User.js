const mongoose = require('mongoose');
const { Schema } = mongoose;

// AuthProvider subdocument for OAuth and local auth
const AuthProvider = new Schema({
  provider: { 
    type: String, 
    enum: ['local', 'google', 'apple'], 
    required: true 
  },
  providerUserId: { 
    type: String, 
    required: true 
  }
}, { _id: false });

const User = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: 3, 
    maxlength: 30, 
    index: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    index: true 
  },
  password: { 
    type: String, 
    minlength: 8, 
    select: false 
  }, // present only for local auth
  firstName: { 
    type: String, 
    required: true, 
    maxlength: 50 
  },
  lastName: { 
    type: String, 
    required: true, 
    maxlength: 50 
  },
  roles: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role', 
    index: true 
  }],
  isActive: { 
    type: Boolean, 
    default: true, 
    index: true 
  },
  lastLogin: { 
    type: Date, 
    index: true 
  },
  profile: {
    bio: { 
      type: String, 
      maxlength: 500 
    },
    location: { 
      type: String, 
      maxlength: 100 
    },
    website: { 
      type: String, 
      maxlength: 200 
    }
  },
  authProviders: { 
    type: [AuthProvider], 
    default: [] 
  }
}, { 
  timestamps: true 
});

// Compound index for auth providers
User.index(
  { 'authProviders.provider': 1, 'authProviders.providerUserId': 1 }, 
  { unique: true, sparse: true }
);

// Additional indexes for common queries
User.index({ isActive: 1, roles: 1 });
User.index({ email: 1, isActive: 1 });

module.exports = mongoose.model('User', User);
