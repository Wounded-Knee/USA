const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      // Password is required only if not using OAuth
      return !this.googleId;
    },
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  // User roles - array of role strings
  roles: {
    type: [String],
    default: [],
    enum: ['Developer', 'Admin', 'Moderator', 'User'] // Add more roles as needed
  },
  // OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  googleEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String
  },
  // User's total capital across all petitions
  totalCapital: {
    type: Number,
    default: 0,
    min: 0
  },
  // Authentication method
  authMethod: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  // Email verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  // Last login
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Note: Indexes are automatically created by unique: true properties
// No need for explicit index() calls

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to check if user can authenticate
userSchema.methods.canAuthenticate = function() {
  return this.isActive && (this.password || this.googleId);
};

// Method to check if user has a specific role
userSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

// Method to check if user has any of the specified roles
userSchema.methods.hasAnyRole = function(roles) {
  return this.roles.some(role => roles.includes(role));
};

// Method to add a role to user
userSchema.methods.addRole = function(role) {
  if (!this.roles.includes(role)) {
    this.roles.push(role);
  }
  return this;
};

// Method to remove a role from user
userSchema.methods.removeRole = function(role) {
  this.roles = this.roles.filter(r => r !== role);
  return this;
};

module.exports = mongoose.model('User', userSchema);
