const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Vote = require('../models/Vote');
const Vigor = require('../models/Vigor');
const Capital = require('../models/Capital');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).single('avatar');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      authMethod: 'local'
    });

    const newUser = await user.save();
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { username, email, firstName, lastName, avatar, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email or username is being changed and if it conflicts
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, firstName, lastName, avatar, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST upload avatar
router.post('/:id/avatar', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete old avatar file if it exists
      if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
        const oldAvatarPath = path.join(__dirname, '..', user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      // Update user with new avatar path
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { avatar: avatarPath },
        { new: true, runValidators: true }
      ).select('-password');

      res.json({
        message: 'Avatar uploaded successfully',
        avatar: avatarPath,
        user: updatedUser
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
});

// GET user votes with petition details and capital
router.get('/:id/votes', auth, async (req, res) => {
  try {
    // Ensure user can only access their own votes
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const votes = await Vote.find({ user: req.params.id })
      .populate('petition', 'title description status')
      .sort({ createdAt: -1 });

    // Get capital information for each vote
    const votesWithCapital = await Promise.all(
      votes.map(async (vote) => {
        const capitalEntry = await Capital.findOne({ 
          user: req.params.id, 
          petition: vote.petition._id,
          isActive: true 
        });
        
        const voteObj = vote.toObject();
        voteObj.capital = capitalEntry ? capitalEntry.capitalAmount : 0;
        return voteObj;
      })
    );

    res.json(votesWithCapital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user statistics
router.get('/:id/stats', auth, async (req, res) => {
  try {
    // Ensure user can only access their own stats
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userId = req.params.id;

    // Get vote statistics
    const votes = await Vote.find({ user: userId });
    const totalVotes = votes.length;
    const totalVigor = votes.reduce((sum, vote) => sum + vote.totalVigor, 0);
    const averageVigor = totalVotes > 0 ? totalVigor / totalVotes : 0;
    const petitionsSupported = new Set(votes.map(vote => vote.petition.toString())).size;

    // Get capital statistics
    const capitalEntries = await Capital.find({ user: userId, isActive: true });
    const totalCapital = capitalEntries.reduce((sum, entry) => {
      if (entry.capitalType === 'earned' || entry.capitalType === 'bonus') {
        return sum + entry.capitalAmount;
      } else {
        return sum - entry.capitalAmount;
      }
    }, 0);

    res.json({
      totalVotes,
      totalVigor,
      averageVigor,
      petitionsSupported,
      totalCapital
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update user (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    // Ensure user can only update their own profile
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { username, email, firstName, lastName, avatar } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email or username is being changed and if it conflicts
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, firstName, lastName, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
