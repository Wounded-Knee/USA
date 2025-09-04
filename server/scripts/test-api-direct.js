const mongoose = require('mongoose');
const { Identity } = require('../models/Identity/Identity');
require('dotenv').config();

async function testAPIDirect() {
  try {
    console.log('🔌 Testing API directly...\n');
    
    // Check environment
    console.log('📋 Environment check:');
    console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
    console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
    
    // Connect to database
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Check database info
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database: ${dbName}`);
    
    // Count identities
    const total = await Identity.countDocuments();
    console.log(`📊 Total identities: ${total}`);
    
    if (total > 0) {
      // Get top-level categories
      const categories = await Identity.find({ level: 0 }).select('id name slug abbr color');
      console.log(`\n🏛️ Top-level categories (${categories.length}):`);
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.abbr}) - ${cat.color}`);
      });
      
      // Test a specific query
      const democrats = await Identity.find({ path: { $in: [2] } }).select('id name level');
      console.log(`\n🔵 Democrats (${democrats.length}):`);
      democrats.slice(0, 5).forEach(d => {
        console.log(`  - ${d.name} (Level ${d.level})`);
      });
      
      // Test search
      const searchResults = await Identity.find({ 
        $or: [
          { name: { $regex: 'democrat', $options: 'i' } },
          { description: { $regex: 'democrat', $options: 'i' } }
        ]
      }).select('id name level').limit(5);
      
      console.log(`\n🔍 Search for 'democrat' (${searchResults.length}):`);
      searchResults.forEach(result => {
        console.log(`  - ${result.name} (Level ${result.level})`);
      });
      
    } else {
      console.log('❌ No identities found in database');
      
      // Check if collection exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\n📚 Collections in database:');
      collections.forEach(col => {
        console.log(`  - ${col.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run if this script is executed directly
if (require.main === module) {
  testAPIDirect();
}

module.exports = testAPIDirect;
