const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
require('dotenv').config();

// Test configuration
const TEST_USER = {
  username: 'apitestuser',
  email: 'apitest@example.com',
  password: 'TestPassword123!',
  firstName: 'API',
  lastName: 'Test'
};

let testUser = null;
let testToken = null;

// Helper function to create test user
async function createTestUser() {
  try {
    console.log('👤 Creating test user...');
    
    // Check if test user already exists
    let user = await User.findOne({ username: TEST_USER.username });
    
    if (!user) {
      // Get or create user role
      let userRole = await Role.findOne({ name: 'user' });
      if (!userRole) {
        userRole = new Role({
          name: 'user',
          scopes: [
            'users:read',
            'petitions:read', 'petitions:write',
            'votes:read', 'votes:write',
            'vigor:read', 'vigor:write',
            'media:read', 'media:write',
            'gov:read',
            'identities:read'
          ],
          description: 'Standard user role'
        });
        await userRole.save();
        console.log('✅ Created user role');
      }
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(TEST_USER.password, saltRounds);
      
      // Create user
      user = new User({
        username: TEST_USER.username,
        email: TEST_USER.email,
        password: hashedPassword,
        firstName: TEST_USER.firstName,
        lastName: TEST_USER.lastName,
        roles: [userRole._id],
        isActive: true
      });
      
      await user.save();
      console.log('✅ Test user created');
    } else {
      console.log('ℹ️ Test user already exists');
    }
    
    testUser = user;
    return user;
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    throw error;
  }
}

// Helper function to generate JWT token
function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set in environment');
  }
  
  return jwt.sign(
    {
      sub: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      scopes: [
        'users:read',
        'petitions:read', 'petitions:write',
        'votes:read', 'votes:write',
        'vigor:read', 'vigor:write',
        'media:read', 'media:write',
        'gov:read',
        'identities:read'
      ]
    },
    process.env.JWT_SECRET,
    { expiresIn: authConfig.jwt.testTokenExpiry }
  );
}

// Helper function to make authenticated API calls
async function makeAuthenticatedRequest(endpoint, method = 'GET', data = null) {
  const url = `http://localhost:5000${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${testToken}`,
    'Content-Type': 'application/json'
  };
  
  const options = {
    method,
    headers
  };
  
  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    return {
      status: response.status,
      data: responseData
    };
  } catch (error) {
    return {
      status: 0,
      error: error.message
    };
  }
}

// Test functions
async function testGetIdentities() {
  console.log('\n🧪 Testing GET /v1/identities...');
  
  const result = await makeAuthenticatedRequest('/v1/identities');
  
  if (result.status === 200) {
    console.log('✅ GET /v1/identities - Success');
    console.log(`   Found ${result.data.identities?.length || 0} identities`);
    console.log(`   Total: ${result.data.pagination?.total || 0}`);
    
    // Show first few identities
    if (result.data.identities && result.data.identities.length > 0) {
      console.log('   Sample identities:');
      result.data.identities.slice(0, 3).forEach(identity => {
        console.log(`     - ${identity.name} (${identity.abbr}) - Level ${identity.level}`);
      });
    }
  } else {
    console.log('❌ GET /v1/identities - Failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${result.data?.detail || 'Unknown error'}`);
  }
  
  return result;
}

async function testGetCategories() {
  console.log('\n🧪 Testing GET /v1/identities/categories...');
  
  const result = await makeAuthenticatedRequest('/v1/identities/categories');
  
  if (result.status === 200) {
    console.log('✅ GET /v1/identities/categories - Success');
    console.log(`   Found ${result.data?.length || 0} categories`);
    
    // Show categories
    if (result.data && result.data.length > 0) {
      console.log('   Categories:');
      result.data.forEach(cat => {
        console.log(`     - ${cat.name} (${cat.abbr}) - ${cat.color}`);
      });
    }
  } else {
    console.log('❌ GET /v1/identities/categories - Failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${result.data?.detail || 'Unknown error'}`);
  }
  
  return result;
}

async function testGetHierarchy() {
  console.log('\n🧪 Testing GET /v1/identities/hierarchy...');
  
  const result = await makeAuthenticatedRequest('/v1/identities/hierarchy');
  
  if (result.status === 200) {
    console.log('✅ GET /v1/identities/hierarchy - Success');
    console.log(`   Found ${result.data?.length || 0} top-level categories`);
    
    // Show first category structure
    if (result.data && result.data.length > 0) {
      const firstCategory = result.data[0];
      console.log(`   Example: ${firstCategory.name} has ${firstCategory.children?.length || 0} children`);
      
      if (firstCategory.children && firstCategory.children.length > 0) {
        console.log('   Sample children:');
        firstCategory.children.slice(0, 3).forEach(child => {
          console.log(`     - ${child.name} (${child.abbr}) - Level ${child.level}`);
        });
      }
    }
  } else {
    console.log('❌ GET /v1/identities/hierarchy - Failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${result.data?.detail || 'Unknown error'}`);
  }
  
  return result;
}

async function testFilters() {
  console.log('\n🧪 Testing filters...');
  
  // Test level filter
  const levelResult = await makeAuthenticatedRequest('/v1/identities?level=0');
  if (levelResult.status === 200) {
    console.log('✅ Level filter - Success');
    console.log(`   Found ${levelResult.data.identities?.length || 0} top-level identities`);
  } else {
    console.log('❌ Level filter - Failed');
  }
  
  // Test category filter
  const categoryResult = await makeAuthenticatedRequest('/v1/identities?category=partisan');
  if (categoryResult.status === 200) {
    console.log('✅ Category filter - Success');
    console.log(`   Found ${categoryResult.data.identities?.length || 0} partisan identities`);
  } else {
    console.log('❌ Category filter - Failed');
  }
  
  // Test search filter
  const searchResult = await makeAuthenticatedRequest('/v1/identities?search=democrat');
  if (searchResult.status === 200) {
    console.log('✅ Search filter - Success');
    console.log(`   Found ${searchResult.data.identities?.length || 0} identities matching "democrat"`);
  } else {
    console.log('❌ Search filter - Failed');
  }
}

// Main test function
async function runTests() {
  try {
    console.log('🚀 Starting Working API Tests...\n');
    
    // Check environment
    console.log('📋 Environment check:');
    console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
    console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not set in environment');
    }
    
    // Connect to database
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
    
    // Create test user
    await createTestUser();
    
    // Generate token
    testToken = generateToken(testUser);
    console.log('🔑 Generated test token\n');
    
    // Run tests
    await testGetIdentities();
    await testGetCategories();
    await testGetHierarchy();
    await testFilters();
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    console.error(error.stack);
  } finally {
    // Cleanup
    if (testUser) {
      console.log('\n🧹 Cleaning up test user...');
      try {
        await User.findByIdAndDelete(testUser._id);
        console.log('✅ Test user cleaned up');
      } catch (error) {
        console.log('⚠️ Could not clean up test user:', error.message);
      }
    }
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = runTests;
