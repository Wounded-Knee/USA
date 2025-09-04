const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const { Identity } = require('../models/Identity/Identity');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
require('dotenv').config();

// Test configuration
const TEST_USER = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

let testUser = null;
let testToken = null;
let testIdentities = [];

// Helper function to create test user with proper roles
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
       } else {
         // Ensure the role has the identities:read scope
         if (!userRole.scopes.includes('identities:read')) {
           userRole.scopes.push('identities:read');
           await userRole.save();
           console.log('✅ Added identities:read scope to existing user role');
         }
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
        roles: ['user'], // Use string role name, not ObjectId
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
  } else {
    console.log('❌ GET /v1/identities - Failed');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${result.data?.detail || 'Unknown error'}`);
  }
  
  return result;
}

async function testGetIdentitiesWithFilters() {
  console.log('\n🧪 Testing GET /v1/identities with filters...');
  
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
    }
  } else {
    console.log('❌ GET /v1/identities/hierarchy - Failed');
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

async function testGetIdentityById() {
  console.log('\n🧪 Testing GET /v1/identities/:id...');
  
  // First get a list of identities to find an ID
  const listResult = await makeAuthenticatedRequest('/v1/identities?limit=1');
  
  if (listResult.status === 200 && listResult.data.identities?.length > 0) {
    const identity = listResult.data.identities[0];
    const id = identity.id;
    
    // Test by ID
    const result = await makeAuthenticatedRequest(`/v1/identities/${id}`);
    
    if (result.status === 200) {
      console.log('✅ GET /v1/identities/:id - Success');
      console.log(`   Retrieved: ${result.data.name} (${result.data.abbr})`);
    } else {
      console.log('❌ GET /v1/identities/:id - Failed');
      console.log(`   Status: ${result.status}`);
    }
    
    // Test by slug
    const slugResult = await makeAuthenticatedRequest(`/v1/identities/${identity.slug}`);
    
    if (slugResult.status === 200) {
      console.log('✅ GET /v1/identities/:slug - Success');
      console.log(`   Retrieved by slug: ${slugResult.data.name}`);
    } else {
      console.log('❌ GET /v1/identities/:slug - Failed');
    }
  } else {
    console.log('❌ Cannot test GET /v1/identities/:id - No identities found');
  }
}

async function testGetDescendants() {
  console.log('\n🧪 Testing GET /v1/identities/:id/descendants...');
  
  // Find a top-level identity
  const listResult = await makeAuthenticatedRequest('/v1/identities?level=0&limit=1');
  
  if (listResult.status === 200 && listResult.data.identities?.length > 0) {
    const identity = listResult.data.identities[0];
    const id = identity.id;
    
    const result = await makeAuthenticatedRequest(`/v1/identities/${id}/descendants`);
    
    if (result.status === 200) {
      console.log('✅ GET /v1/identities/:id/descendants - Success');
      console.log(`   Found ${result.data?.length || 0} descendants of ${identity.name}`);
    } else {
      console.log('❌ GET /v1/identities/:id/descendants - Failed');
      console.log(`   Status: ${result.status}`);
    }
  } else {
    console.log('❌ Cannot test GET /v1/identities/:id/descendants - No top-level identities found');
  }
}

async function testUnauthenticatedAccess() {
  console.log('\n🧪 Testing unauthenticated access...');
  
  const endpoints = [
    '/v1/identities',
    '/v1/identities/categories',
    '/v1/identities/hierarchy'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`);
      const data = await response.json();
      
      if (response.status === 401) {
        console.log(`✅ ${endpoint} - Properly protected (401 Unauthorized)`);
      } else {
        console.log(`❌ ${endpoint} - Not properly protected (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Request failed: ${error.message}`);
    }
  }
}

// Main test function
async function runTests() {
  try {
    console.log('🚀 Starting Identities API Tests...\n');
    
    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Create test user
    await createTestUser();
    
    // Generate token
    testToken = generateToken(testUser);
    console.log('🔑 Generated test token\n');
    
    // Run tests
    await testUnauthenticatedAccess();
    await testGetIdentities();
    await testGetIdentitiesWithFilters();
    await testGetHierarchy();
    await testGetCategories();
    await testGetIdentityById();
    await testGetDescendants();
    
    console.log('\n🎉 All tests completed!');
    
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
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = runTests;
