const mongoose = require('mongoose');
const Identity = require('../models/Identity');
require('dotenv').config();

async function simpleTest() {
  try {
    console.log('🧪 Simple API Test...\n');
    
    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Count identities
    const total = await Identity.countDocuments();
    console.log(`📊 Total identities: ${total}`);
    
    if (total > 0) {
      // Get a few identities
      const identities = await Identity.find().limit(3).select('id name level');
      console.log('\n📝 Sample identities:');
      identities.forEach(identity => {
        console.log(`  - ${identity.name} (Level ${identity.level})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run test
simpleTest();
