const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const assignDeveloperRole = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find Joel Kramer by name
    const joelKramer = await User.findOne({
      firstName: 'Joel',
      lastName: 'Kramer'
    });

    if (!joelKramer) {
      console.log('Joel Kramer not found in database. Creating user...');
      
      // Create Joel Kramer if he doesn't exist
      const newUser = new User({
        username: 'joelkramer',
        email: 'joel.kramer@example.com', // You may want to update this
        firstName: 'Joel',
        lastName: 'Kramer',
        password: 'tempPassword123', // This should be changed after first login
        authMethod: 'local',
        roles: ['Developer'],
        isActive: true,
        emailVerified: true
      });

      await newUser.save();
      console.log('✅ Joel Kramer created with Developer role');
    } else {
      // Add Developer role if not already present
      if (!joelKramer.roles.includes('Developer')) {
        joelKramer.roles.push('Developer');
        await joelKramer.save();
        console.log('✅ Developer role assigned to Joel Kramer');
      } else {
        console.log('ℹ️ Joel Kramer already has Developer role');
      }
    }

    // Display the updated user info
    const updatedUser = await User.findOne({
      firstName: 'Joel',
      lastName: 'Kramer'
    }).select('-password');

    console.log('User details:', updatedUser);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
assignDeveloperRole();
