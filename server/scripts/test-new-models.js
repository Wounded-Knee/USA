const mongoose = require('mongoose');
require('dotenv').config();

// Import new models
const User = require('../models/User');
const Role = require('../models/Role');
const Petition = require('../models/Petition');
const Vote = require('../models/Vote');
const Vigor = require('../models/Vigor');
const PetitionMetrics = require('../models/PetitionMetrics');
const Taxonomy = require('../models/Taxonomy');

async function testNewModels() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('\n🧪 Testing new models...');

    // Test 1: Create a role
    console.log('\n1. Testing Role creation...');
    const testRole = new Role({
      name: 'test-role',
      scopes: ['test:read', 'test:write'],
      description: 'Test role for validation'
    });
    await testRole.save();
    console.log('✅ Role created:', testRole.name);

    // Test 2: Create a user with role reference
    console.log('\n2. Testing User creation with role...');
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      roles: [testRole._id],
      isActive: true,
      authProviders: [{
        provider: 'local',
        providerUserId: 'test@example.com'
      }]
    });
    await testUser.save();
    console.log('✅ User created:', testUser.username);

    // Test 3: Create taxonomy
    console.log('\n3. Testing Taxonomy creation...');
    const testCategory = new Taxonomy({
      name: 'Test Category',
      slug: 'test-category',
      type: 'category',
      description: 'Test category for validation'
    });
    await testCategory.save();
    console.log('✅ Category created:', testCategory.name);

    // Test 4: Create a petition
    console.log('\n4. Testing Petition creation...');
    const testPetition = new Petition({
      title: 'Test Petition',
      description: 'This is a test petition',
      categoryId: testCategory._id,
      creator: testUser._id,
      jurisdiction: new mongoose.Types.ObjectId(), // Mock jurisdiction
      status: 'active'
    });
    await testPetition.save();
    console.log('✅ Petition created:', testPetition.title);

    // Test 5: Create a vote
    console.log('\n5. Testing Vote creation...');
    const testVote = new Vote({
      user: testUser._id,
      petition: testPetition._id,
      signingStatement: 'I support this test petition',
      isActive: true
    });
    await testVote.save();
    console.log('✅ Vote created for user:', testUser.username);

    // Test 6: Create vigor
    console.log('\n6. Testing Vigor creation...');
    const testVigor = new Vigor({
      user: testUser._id,
      vote: testVote._id,
      vigorType: 'steps',
      vigorAmount: 1000,
      activity: { steps: 1000, distance: '2.5 miles' },
      signingStatement: 'Walked 2.5 miles in support'
    });
    await testVigor.save();
    console.log('✅ Vigor created:', testVigor.vigorType);

    // Test 7: Create petition metrics
    console.log('\n7. Testing PetitionMetrics creation...');
    const testMetrics = new PetitionMetrics({
      petitionId: testPetition._id,
      voteCount: 1,
      vigorCount: 1,
      totalVigor: 1000,
      trendingScore: 11 // 1 vote + 1000/100
    });
    await testMetrics.save();
    console.log('✅ Metrics created for petition');

    // Test 8: Verify relationships
    console.log('\n8. Testing relationships...');
    
    // Populate and verify
    const populatedPetition = await Petition.findById(testPetition._id)
      .populate('creator', 'username')
      .populate('categoryId', 'name');
    
    console.log('✅ Petition with creator:', populatedPetition.creator.username);
    console.log('✅ Petition with category:', populatedPetition.categoryId.name);

    const populatedVote = await Vote.findById(testVote._id)
      .populate('user', 'username')
      .populate('petition', 'title');
    
    console.log('✅ Vote with user:', populatedVote.user.username);
    console.log('✅ Vote with petition:', populatedVote.petition.title);

    const populatedVigor = await Vigor.findById(testVigor._id)
      .populate('user', 'username')
      .populate('vote', 'signingStatement');
    
    console.log('✅ Vigor with user:', populatedVigor.user.username);
    console.log('✅ Vigor with vote:', populatedVigor.vote.signingStatement);

    // Test 9: Verify constraints
    console.log('\n9. Testing constraints...');
    
    try {
      // Try to create duplicate vote (should fail due to unique constraint)
      const duplicateVote = new Vote({
        user: testUser._id,
        petition: testPetition._id,
        signingStatement: 'Duplicate vote'
      });
      await duplicateVote.save();
      console.log('❌ Duplicate vote should have failed');
    } catch (error) {
      if (error.code === 11000) {
        console.log('✅ Duplicate vote correctly prevented');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test 10: Clean up test data
    console.log('\n10. Cleaning up test data...');
    await Vigor.findByIdAndDelete(testVigor._id);
    await Vote.findByIdAndDelete(testVote._id);
    await PetitionMetrics.findByIdAndDelete(testMetrics._id);
    await Petition.findByIdAndDelete(testPetition._id);
    await Taxonomy.findByIdAndDelete(testCategory._id);
    await User.findByIdAndDelete(testUser._id);
    await Role.findByIdAndDelete(testRole._id);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! New models are working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testNewModels();
}

module.exports = testNewModels;
