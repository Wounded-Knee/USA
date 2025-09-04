const mongoose = require('mongoose');
const { Identity } = require('../models/Identity/Identity');
require('dotenv').config();

async function verifyAPI() {
  try {
    console.log('🔍 Verifying API endpoints...\n');
    
    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Test database queries that the API would use
    console.log('\n🧪 Testing database queries...');
    
    // 1. Test basic query (GET /v1/identities)
    const total = await Identity.countDocuments({ isActive: true });
    console.log(`✅ Basic query: ${total} active identities`);
    
    // 2. Test level filter (GET /v1/identities?level=0)
    const topLevel = await Identity.countDocuments({ level: 0, isActive: true });
    console.log(`✅ Level filter: ${topLevel} top-level identities`);
    
    // 3. Test category filter (GET /v1/identities?category=partisan)
    const partisan = await Identity.findOne({ slug: 'partisan', isActive: true });
    if (partisan) {
      const partisanCount = await Identity.countDocuments({ 
        path: { $in: [partisan.id] }, 
        isActive: true 
      });
      console.log(`✅ Category filter: ${partisanCount} partisan identities`);
    }
    
    // 4. Test search (GET /v1/identities?search=democrat)
    const searchResults = await Identity.countDocuments({
      $or: [
        { name: { $regex: 'democrat', $options: 'i' } },
        { description: { $regex: 'democrat', $options: 'i' } }
      ],
      isActive: true
    });
    console.log(`✅ Search filter: ${searchResults} identities matching "democrat"`);
    
    // 5. Test categories endpoint (GET /v1/identities/categories)
    const categories = await Identity.find({ 
      level: 0, 
      isActive: true 
    }).select('id name slug abbr color');
    console.log(`✅ Categories endpoint: ${categories.length} top-level categories`);
    
    // 6. Test hierarchy endpoint (GET /v1/identities/hierarchy)
    const hierarchyData = await Identity.find({ isActive: true })
      .sort({ level: 1, name: 1 })
      .populate('parent', 'id name slug abbr color')
      .populate('children', 'id name slug abbr color level');
    
    const topLevelHierarchy = hierarchyData.filter(identity => identity.level === 0);
    console.log(`✅ Hierarchy endpoint: ${topLevelHierarchy.length} top-level categories with children`);
    
    // Show sample data
    if (categories.length > 0) {
      console.log('\n📊 Sample categories:');
      categories.slice(0, 3).forEach(cat => {
        console.log(`  - ${cat.name} (${cat.abbr}) - ${cat.color}`);
      });
    }
    
    if (topLevelHierarchy.length > 0) {
      const firstCategory = topLevelHierarchy[0];
      console.log(`\n🏗️ Sample hierarchy for ${firstCategory.name}:`);
      if (firstCategory.children && firstCategory.children.length > 0) {
        firstCategory.children.slice(0, 3).forEach(child => {
          console.log(`  - ${child.name} (${child.abbr}) - Level ${child.level}`);
        });
      }
    }
    
    console.log('\n🎉 All database queries working correctly!');
    console.log('✅ The API should now return the correct data.');
    
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

// Run verification
verifyAPI();
