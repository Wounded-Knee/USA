const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const UserIdentity = require('../models/UserIdentity');
const { Identity } = require('../models/Identity/Identity');

async function testModels() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test User model with new fields
    console.log('\n--- Testing User Model ---');
    
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      birthdate: new Date('1990-01-01'),
      race: 'White',
      gender: 'Male',
      income: '50k_75k',
      religion: 'Christianity',
      politicalPriorities: ['Healthcare', 'Education', 'Climate Change'],
      roles: ['user'],
      isActive: true
    });

    console.log('Test user data:', {
      username: testUser.username,
      birthdate: testUser.birthdate,
      race: testUser.race,
      gender: testUser.gender,
      income: testUser.income,
      religion: testUser.religion,
      politicalPriorities: testUser.politicalPriorities
    });

    // Test UserIdentity model
    console.log('\n--- Testing UserIdentity Model ---');
    
    const testPoliticalIdentity = new UserIdentity({
      userId: new mongoose.Types.ObjectId(), // Mock user ID
      identityId: 1, // Mock identity ID
      rank: 1,
      isActive: true
    });

    console.log('Test political identity data:', {
      userId: testPoliticalIdentity.userId,
      identityId: testPoliticalIdentity.identityId,
      rank: testPoliticalIdentity.rank,
      isActive: testPoliticalIdentity.isActive
    });

    // Test validation
    console.log('\n--- Testing Validation ---');
    
    try {
      await testUser.validate();
      console.log('✅ User validation passed');
    } catch (error) {
      console.log('❌ User validation failed:', error.message);
    }

    try {
      await testPoliticalIdentity.validate();
      console.log('✅ UserIdentity validation passed');
    } catch (error) {
      console.log('❌ UserIdentity validation failed:', error.message);
    }

    console.log('\n--- Model Test Complete ---');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testModels();

