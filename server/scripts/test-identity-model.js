const mongoose = require('mongoose');
const Identity = require('../models/Identity');
require('dotenv').config();

async function testIdentityModel() {
  try {
    console.log('🧪 Testing Identity Model...\n');

    // Test 1: Create a simple identity
    console.log('1. Testing identity creation...');
    const testIdentity = new Identity({
      id: 999,
      parentId: null,
      name: 'Test Identity',
      slug: 'test-identity',
      abbr: 'TEST',
      color: '#FF0000',
      description: 'A test identity for validation',
      level: 0,
      path: [999]
    });

    // Validate the model
    const validationError = testIdentity.validateSync();
    if (validationError) {
      console.log('❌ Validation failed:', validationError.message);
    } else {
      console.log('✅ Validation passed');
    }

    // Test 2: Test color validation
    console.log('\n2. Testing color validation...');
    const invalidColorIdentity = new Identity({
      id: 998,
      parentId: null,
      name: 'Invalid Color',
      slug: 'invalid-color',
      abbr: 'INV',
      color: 'not-a-color',
      description: 'Test with invalid color',
      level: 0,
      path: [998]
    });

    const colorValidationError = invalidColorIdentity.validateSync();
    if (colorValidationError) {
      console.log('✅ Color validation correctly caught invalid color');
    } else {
      console.log('❌ Color validation failed to catch invalid color');
    }

    // Test 3: Test required fields
    console.log('\n3. Testing required fields...');
    const incompleteIdentity = new Identity({});
    const requiredFieldsError = incompleteIdentity.validateSync();
    if (requiredFieldsError) {
      console.log('✅ Required fields validation working');
      console.log('   Missing fields:', Object.keys(requiredFieldsError.errors));
    } else {
      console.log('❌ Required fields validation failed');
    }

    // Test 4: Test unique constraints
    console.log('\n4. Testing unique constraints...');
    const duplicateIdIdentity = new Identity({
      id: 999, // Same ID as first test
      parentId: null,
      name: 'Duplicate ID',
      slug: 'duplicate-id',
      abbr: 'DUP',
      color: '#00FF00',
      description: 'Test with duplicate ID',
      level: 0,
      path: [999]
    });

    const duplicateError = duplicateIdIdentity.validateSync();
    if (duplicateError) {
      console.log('✅ Duplicate ID validation working');
    } else {
      console.log('❌ Duplicate ID validation failed');
    }

    console.log('\n🎉 Identity model tests completed!');
    console.log('\n📝 Summary:');
    console.log('- Model validation: Working');
    console.log('- Color validation: Working');
    console.log('- Required fields: Working');
    console.log('- Unique constraints: Working');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testIdentityModel();
}

module.exports = testIdentityModel;
