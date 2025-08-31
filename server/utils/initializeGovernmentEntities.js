const mongoose = require('mongoose');
const { Jurisdiction, GoverningBody, Legislation } = require('../models/Government');

/**
 * Initialize government entities for testing
 * This script creates basic federal, state, and local government structures
 */
const initializeGovernmentEntities = async () => {
  try {
    console.log('Initializing government entities...');

    // Step 1: Create federal jurisdiction
    let federalJurisdiction = await Jurisdiction.findOne({ slug: 'usa' });
    if (!federalJurisdiction) {
      federalJurisdiction = new Jurisdiction({
        name: 'United States of America',
        slug: 'usa',
        level: 'federal',
        entity_type: 'jurisdiction',
        path: '/usa',
        depth: 0
      });
      await federalJurisdiction.save();
      console.log('Created federal jurisdiction:', federalJurisdiction._id);
    } else {
      console.log('Federal jurisdiction already exists:', federalJurisdiction._id);
    }

    // Step 2: Create state jurisdictions
    const states = [
      { name: 'California', slug: 'california', level: 'state' },
      { name: 'New York', slug: 'new-york', level: 'state' },
      { name: 'Texas', slug: 'texas', level: 'state' },
      { name: 'Florida', slug: 'florida', level: 'state' },
      { name: 'Illinois', slug: 'illinois', level: 'state' }
    ];

    const stateJurisdictions = [];
    for (const state of states) {
      let stateJurisdiction = await Jurisdiction.findOne({ slug: state.slug });
      if (!stateJurisdiction) {
        stateJurisdiction = new Jurisdiction({
          name: state.name,
          slug: state.slug,
          level: state.level,
          entity_type: 'jurisdiction',
          parent: federalJurisdiction._id,
          path: `/usa/${state.slug}`,
          depth: 1
        });
        await stateJurisdiction.save();
        console.log(`Created state jurisdiction: ${state.name}`);
      } else {
        console.log(`State jurisdiction already exists: ${state.name}`);
      }
      stateJurisdictions.push(stateJurisdiction);
    }

    // Step 3: Create federal governing bodies
    const federalBodies = [
      {
        name: 'United States Congress',
        slug: 'us-congress',
        branch: 'legislative',
        entity_type: 'body'
      },
      {
        name: 'United States Senate',
        slug: 'us-senate',
        branch: 'legislative',
        entity_type: 'body'
      },
      {
        name: 'United States House of Representatives',
        slug: 'us-house',
        branch: 'legislative',
        entity_type: 'body'
      },
      {
        name: 'Executive Office of the President',
        slug: 'executive-office',
        branch: 'executive',
        entity_type: 'body'
      }
    ];

    for (const body of federalBodies) {
      let governingBody = await GoverningBody.findOne({ 
        slug: body.slug, 
        jurisdiction: federalJurisdiction._id 
      });
      if (!governingBody) {
        governingBody = new GoverningBody({
          name: body.name,
          slug: body.slug,
          jurisdiction: federalJurisdiction._id,
          branch: body.branch,
          entity_type: body.entity_type,
          path: `/usa/${body.slug}`,
          depth: 1
        });
        await governingBody.save();
        console.log(`Created federal governing body: ${body.name}`);
      } else {
        console.log(`Federal governing body already exists: ${body.name}`);
      }
    }

    // Step 4: Create state governing bodies (using California as example)
    const californiaJurisdiction = stateJurisdictions.find(s => s.slug === 'california');
    if (californiaJurisdiction) {
      const californiaBodies = [
        {
          name: 'California State Legislature',
          slug: 'ca-legislature',
          branch: 'legislative',
          entity_type: 'body'
        },
        {
          name: 'California State Senate',
          slug: 'ca-senate',
          branch: 'legislative',
          entity_type: 'body'
        },
        {
          name: 'California State Assembly',
          slug: 'ca-assembly',
          branch: 'legislative',
          entity_type: 'body'
        },
        {
          name: 'Office of the Governor of California',
          slug: 'ca-governor',
          branch: 'executive',
          entity_type: 'body'
        }
      ];

      for (const body of californiaBodies) {
        let governingBody = await GoverningBody.findOne({ 
          slug: body.slug, 
          jurisdiction: californiaJurisdiction._id 
        });
        if (!governingBody) {
          governingBody = new GoverningBody({
            name: body.name,
            slug: body.slug,
            jurisdiction: californiaJurisdiction._id,
            branch: body.branch,
            entity_type: body.entity_type,
            path: `/usa/california/${body.slug}`,
            depth: 2
          });
          await governingBody.save();
          console.log(`Created California governing body: ${body.name}`);
        } else {
          console.log(`California governing body already exists: ${body.name}`);
        }
      }
    }

    // Step 5: Create sample legislation
    const usCongress = await GoverningBody.findOne({ slug: 'us-congress' });
    if (usCongress) {
      const sampleLegislation = [
        {
          title: 'Climate Action Now Act',
          bill_number: 'H.R. 9',
          governing_body: usCongress._id,
          jurisdiction: federalJurisdiction._id,
          legislation_type: 'bill',
          status: 'introduced',
          introduced_date: new Date('2023-01-15'),
          summary: 'A bill to require the President to develop a plan for the United States to meet its nationally determined contribution under the Paris Agreement.'
        },
        {
          title: 'Infrastructure Investment and Jobs Act',
          bill_number: 'H.R. 3684',
          governing_body: usCongress._id,
          jurisdiction: federalJurisdiction._id,
          legislation_type: 'bill',
          status: 'signed',
          introduced_date: new Date('2021-06-04'),
          passed_date: new Date('2021-11-15'),
          summary: 'A bill to authorize funds for Federal-aid highways, highway safety programs, and transit programs.'
        }
      ];

      for (const bill of sampleLegislation) {
        let legislation = await Legislation.findOne({ 
          bill_number: bill.bill_number,
          governing_body: bill.governing_body
        });
        if (!legislation) {
          legislation = new Legislation(bill);
          await legislation.save();
          console.log(`Created legislation: ${bill.bill_number} - ${bill.title}`);
        } else {
          console.log(`Legislation already exists: ${bill.bill_number}`);
        }
      }
    }

    console.log('Government entities initialization completed successfully!');
    
    // Summary
    const jurisdictionCount = await Jurisdiction.countDocuments();
    const governingBodyCount = await GoverningBody.countDocuments();
    const legislationCount = await Legislation.countDocuments();
    
    console.log('\nSummary:');
    console.log(`- Jurisdictions: ${jurisdictionCount}`);
    console.log(`- Governing Bodies: ${governingBodyCount}`);
    console.log(`- Legislation: ${legislationCount}`);

  } catch (error) {
    console.error('Error initializing government entities:', error);
    throw error;
  }
};

// Export for use in other scripts
module.exports = {
  initializeGovernmentEntities
};

// Run initialization if this script is executed directly
if (require.main === module) {
  // Load environment variables
  require('dotenv').config();
  
  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/usa';
  
  console.log('Connecting to MongoDB...');
  console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return initializeGovernmentEntities();
    })
    .then(() => {
      console.log('Initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Initialization failed:', error);
      process.exit(1);
    });
}
