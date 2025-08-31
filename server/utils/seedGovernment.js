const { connectDB } = require('./database');
const { 
  Jurisdiction, 
  GoverningBody, 
  Office, 
  Position, 
  Election,
  Legislation,
  Vote,
  Committee,
  District,
  ContactInfo,
  CONSTANTS 
} = require('../models/Government');
const User = require('../models/User');

// ------------------------------
// Seed Data
// ------------------------------

const seedJurisdictions = [
  {
    name: 'United States of America',
    slug: 'usa',
    level: 'federal',
    entity_type: 'jurisdiction',
    parent: null,
    path: '/usa',
    depth: 0,
    identifiers: {
      ocd_id: 'ocd-division/country:us',
      fips: '00',
      geoid: '0400000US00'
    }
  },
  {
    name: 'California',
    slug: 'california',
    level: 'state',
    entity_type: 'jurisdiction',
    parent: null, // Will be set after USA is created
    path: '/usa/california',
    depth: 1,
    identifiers: {
      ocd_id: 'ocd-division/country:us/state:ca',
      fips: '06',
      geoid: '0400000US06'
    }
  },
  {
    name: 'San Mateo County',
    slug: 'san-mateo-county',
    level: 'county',
    entity_type: 'jurisdiction',
    parent: null, // Will be set after California is created
    path: '/usa/california/san-mateo-county',
    depth: 2,
    identifiers: {
      ocd_id: 'ocd-division/country:us/state:ca/county:san_mateo',
      fips: '06081',
      geoid: '0500000US06081'
    }
  },
  {
    name: 'San Francisco',
    slug: 'san-francisco',
    level: 'municipal',
    entity_type: 'jurisdiction',
    parent: null, // Will be set after California is created
    path: '/usa/california/san-francisco',
    depth: 2,
    identifiers: {
      ocd_id: 'ocd-division/country:us/state:ca/place:san_francisco',
      fips: '0667000',
      geoid: '1600000US0667000'
    }
  }
];

const seedGoverningBodies = [
  {
    name: 'United States Congress',
    slug: 'us-congress',
    jurisdiction: null, // Will be set after USA is created
    branch: 'legislative',
    entity_type: 'body',
    parent: null,
    path: '/usa/us-congress',
    depth: 0
  },
  {
    name: 'United States Senate',
    slug: 'us-senate',
    jurisdiction: null, // Will be set after USA is created
    branch: 'legislative',
    entity_type: 'body',
    parent: null, // Will be set after Congress is created
    path: '/usa/us-congress/us-senate',
    depth: 1
  },
  {
    name: 'United States House of Representatives',
    slug: 'us-house',
    jurisdiction: null, // Will be set after USA is created
    branch: 'legislative',
    entity_type: 'body',
    parent: null, // Will be set after Congress is created
    path: '/usa/us-congress/us-house',
    depth: 1
  },
  {
    name: 'California State Legislature',
    slug: 'ca-legislature',
    jurisdiction: null, // Will be set after California is created
    branch: 'legislative',
    entity_type: 'body',
    parent: null,
    path: '/usa/california/ca-legislature',
    depth: 0
  },
  {
    name: 'California State Senate',
    slug: 'ca-senate',
    jurisdiction: null, // Will be set after California is created
    branch: 'legislative',
    entity_type: 'body',
    parent: null, // Will be set after Legislature is created
    path: '/usa/california/ca-legislature/ca-senate',
    depth: 1
  },
  {
    name: 'California State Assembly',
    slug: 'ca-assembly',
    jurisdiction: null, // Will be set after California is created
    branch: 'legislative',
    entity_type: 'body',
    parent: null, // Will be set after Legislature is created
    path: '/usa/california/ca-legislature/ca-assembly',
    depth: 1
  }
];

const seedOffices = [
  {
    name: 'President of the United States',
    slug: 'us-president',
    office_type: 'president',
    governing_body: null, // Will be set after Executive branch is created
    jurisdiction: null, // Will be set after USA is created
    constituency: 'at_large',
    selection_method: 'elected',
    term_length: 48, // 4 years in months
    term_limit: 2,
    salary: 400000,
    is_part_time: false
  },
  {
    name: 'Vice President of the United States',
    slug: 'us-vice-president',
    office_type: 'vice_president',
    governing_body: null, // Will be set after Executive branch is created
    jurisdiction: null, // Will be set after USA is created
    constituency: 'at_large',
    selection_method: 'elected',
    term_length: 48, // 4 years in months
    term_limit: 2,
    salary: 235100,
    is_part_time: false
  },
  {
    name: 'United States Senator',
    slug: 'us-senator',
    office_type: 'senator',
    governing_body: null, // Will be set after Senate is created
    jurisdiction: null, // Will be set after USA is created
    constituency: 'at_large',
    selection_method: 'elected',
    term_length: 72, // 6 years in months
    term_limit: null,
    salary: 174000,
    is_part_time: false
  },
  {
    name: 'United States Representative',
    slug: 'us-representative',
    office_type: 'representative',
    governing_body: null, // Will be set after House is created
    jurisdiction: null, // Will be set after USA is created
    constituency: 'district',
    selection_method: 'elected',
    term_length: 24, // 2 years in months
    term_limit: null,
    salary: 174000,
    is_part_time: false
  },
  {
    name: 'Governor of California',
    slug: 'ca-governor',
    office_type: 'governor',
    governing_body: null, // Will be set after Executive branch is created
    jurisdiction: null, // Will be set after California is created
    constituency: 'at_large',
    selection_method: 'elected',
    term_length: 48, // 4 years in months
    term_limit: 2,
    salary: 210000,
    is_part_time: false
  },
  {
    name: 'California State Senator',
    slug: 'ca-state-senator',
    office_type: 'senator',
    governing_body: null, // Will be set after State Senate is created
    jurisdiction: null, // Will be set after California is created
    constituency: 'district',
    selection_method: 'elected',
    term_length: 48, // 4 years in months
    term_limit: 2,
    salary: 119702,
    is_part_time: false
  },
  {
    name: 'California State Assembly Member',
    slug: 'ca-assembly-member',
    office_type: 'representative',
    governing_body: null, // Will be set after State Assembly is created
    jurisdiction: null, // Will be set after California is created
    constituency: 'district',
    selection_method: 'elected',
    term_length: 24, // 2 years in months
    term_limit: 3,
    salary: 119702,
    is_part_time: false
  }
];

const seedDistricts = [
  {
    name: 'California Congressional District 14',
    slug: 'ca-cd-14',
    jurisdiction: null, // Will be set after California is created
    district_type: 'congressional',
    district_number: 14,
    population: 761000,
    area_sq_miles: 120
  },
  {
    name: 'California State Senate District 13',
    slug: 'ca-sd-13',
    jurisdiction: null, // Will be set after California is created
    district_type: 'state_senate',
    district_number: 13,
    population: 931000,
    area_sq_miles: 150
  },
  {
    name: 'California State Assembly District 24',
    slug: 'ca-ad-24',
    jurisdiction: null, // Will be set after California is created
    district_type: 'state_house',
    district_number: 24,
    population: 465000,
    area_sq_miles: 75
  }
];

// ------------------------------
// Seed Functions
// ------------------------------

async function seedJurisdictionsData() {
  console.log('🌍 Seeding jurisdictions...');
  
  // Create USA first
  const usa = await Jurisdiction.create(seedJurisdictions[0]);
  console.log(`✅ Created: ${usa.name}`);
  
  // Create California with USA as parent
  const californiaData = { ...seedJurisdictions[1], parent: usa._id };
  const california = await Jurisdiction.create(californiaData);
  console.log(`✅ Created: ${california.name}`);
  
  // Create counties and cities with California as parent
  const sanMateoData = { ...seedJurisdictions[2], parent: california._id };
  const sanMateo = await Jurisdiction.create(sanMateoData);
  console.log(`✅ Created: ${sanMateo.name}`);
  
  const sanFranciscoData = { ...seedJurisdictions[3], parent: california._id };
  const sanFrancisco = await Jurisdiction.create(sanFranciscoData);
  console.log(`✅ Created: ${sanFrancisco.name}`);
  
  return { usa, california, sanMateo, sanFrancisco };
}

async function seedGoverningBodiesData(jurisdictions) {
  console.log('🏛️ Seeding governing bodies...');
  
  // Create US Congress
  const usCongressData = { ...seedGoverningBodies[0], jurisdiction: jurisdictions.usa._id };
  const usCongress = await GoverningBody.create(usCongressData);
  console.log(`✅ Created: ${usCongress.name}`);
  
  // Create US Senate and House with Congress as parent
  const usSenateData = { ...seedGoverningBodies[1], jurisdiction: jurisdictions.usa._id, parent: usCongress._id };
  const usSenate = await GoverningBody.create(usSenateData);
  console.log(`✅ Created: ${usSenate.name}`);
  
  const usHouseData = { ...seedGoverningBodies[2], jurisdiction: jurisdictions.usa._id, parent: usCongress._id };
  const usHouse = await GoverningBody.create(usHouseData);
  console.log(`✅ Created: ${usHouse.name}`);
  
  // Create California Legislature
  const caLegislatureData = { ...seedGoverningBodies[3], jurisdiction: jurisdictions.california._id };
  const caLegislature = await GoverningBody.create(caLegislatureData);
  console.log(`✅ Created: ${caLegislature.name}`);
  
  // Create California Senate and Assembly with Legislature as parent
  const caSenateData = { ...seedGoverningBodies[4], jurisdiction: jurisdictions.california._id, parent: caLegislature._id };
  const caSenate = await GoverningBody.create(caSenateData);
  console.log(`✅ Created: ${caSenate.name}`);
  
  const caAssemblyData = { ...seedGoverningBodies[5], jurisdiction: jurisdictions.california._id, parent: caLegislature._id };
  const caAssembly = await GoverningBody.create(caAssemblyData);
  console.log(`✅ Created: ${caAssembly.name}`);
  
  return { usCongress, usSenate, usHouse, caLegislature, caSenate, caAssembly };
}

async function seedOfficesData(jurisdictions, governingBodies) {
  console.log('👔 Seeding offices...');
  
  // Create US offices (executive offices don't have governing_body)
  const usPresidentData = { ...seedOffices[0], jurisdiction: jurisdictions.usa._id, governing_body: null };
  const usPresident = await Office.create(usPresidentData);
  console.log(`✅ Created: ${usPresident.name}`);
  
  const usVicePresidentData = { ...seedOffices[1], jurisdiction: jurisdictions.usa._id, governing_body: null };
  const usVicePresident = await Office.create(usVicePresidentData);
  console.log(`✅ Created: ${usVicePresident.name}`);
  
  const usSenatorData = { ...seedOffices[2], jurisdiction: jurisdictions.usa._id, governing_body: governingBodies.usSenate._id };
  const usSenator = await Office.create(usSenatorData);
  console.log(`✅ Created: ${usSenator.name}`);
  
  const usRepresentativeData = { ...seedOffices[3], jurisdiction: jurisdictions.usa._id, governing_body: governingBodies.usHouse._id };
  const usRepresentative = await Office.create(usRepresentativeData);
  console.log(`✅ Created: ${usRepresentative.name}`);
  
  // Create California offices (executive offices don't have governing_body)
  const caGovernorData = { ...seedOffices[4], jurisdiction: jurisdictions.california._id, governing_body: null };
  const caGovernor = await Office.create(caGovernorData);
  console.log(`✅ Created: ${caGovernor.name}`);
  
  const caStateSenatorData = { ...seedOffices[5], jurisdiction: jurisdictions.california._id, governing_body: governingBodies.caSenate._id };
  const caStateSenator = await Office.create(caStateSenatorData);
  console.log(`✅ Created: ${caStateSenator.name}`);
  
  const caAssemblyMemberData = { ...seedOffices[6], jurisdiction: jurisdictions.california._id, governing_body: governingBodies.caAssembly._id };
  const caAssemblyMember = await Office.create(caAssemblyMemberData);
  console.log(`✅ Created: ${caAssemblyMember.name}`);
  
  return { usPresident, usVicePresident, usSenator, usRepresentative, caGovernor, caStateSenator, caAssemblyMember };
}

async function seedDistrictsData(jurisdictions) {
  console.log('🗺️ Seeding districts...');
  
  const districts = [];
  
  for (const districtData of seedDistricts) {
    const data = { ...districtData, jurisdiction: jurisdictions.california._id };
    const district = await District.create(data);
    districts.push(district);
    console.log(`✅ Created: ${district.name}`);
  }
  
  return districts;
}

async function seedContactInfo(jurisdictions, governingBodies) {
  console.log('📞 Seeding contact information...');
  
  // USA contact info
  await ContactInfo.create({
    entity_type: 'jurisdiction',
    entity_id: jurisdictions.usa._id,
    address: {
      street: '1600 Pennsylvania Avenue NW',
      city: 'Washington',
      state: 'DC',
      zip: '20500',
      country: 'USA'
    },
    phone: '(202) 456-1111',
    website: 'https://www.whitehouse.gov',
    social_media: {
      twitter: '@POTUS',
      facebook: 'WhiteHouse'
    }
  });
  console.log('✅ Created: USA contact info');
  
  // California contact info
  await ContactInfo.create({
    entity_type: 'jurisdiction',
    entity_id: jurisdictions.california._id,
    address: {
      street: '1303 10th Street',
      city: 'Sacramento',
      state: 'CA',
      zip: '95814',
      country: 'USA'
    },
    phone: '(916) 445-2841',
    website: 'https://www.ca.gov',
    social_media: {
      twitter: '@CAgovernor',
      facebook: 'CAgovernor'
    }
  });
  console.log('✅ Created: California contact info');
  
  // US Congress contact info
  await ContactInfo.create({
    entity_type: 'governing_body',
    entity_id: governingBodies.usCongress._id,
    address: {
      street: 'United States Capitol',
      city: 'Washington',
      state: 'DC',
      zip: '20515',
      country: 'USA'
    },
    phone: '(202) 224-3121',
    website: 'https://www.congress.gov',
    social_media: {
      twitter: '@USCongress',
      facebook: 'USCongress'
    }
  });
  console.log('✅ Created: US Congress contact info');
}

// ------------------------------
// Main Seed Function
// ------------------------------

async function seedGovernmentData() {
  try {
    console.log('🚀 Starting government data seeding...');
    
    // Connect to database
    await connectDB();
    
    // Check if data already exists
    const existingJurisdictions = await Jurisdiction.countDocuments();
    if (existingJurisdictions > 0) {
      console.log('⚠️ Government data already exists. Skipping seeding.');
      return;
    }
    
    // Seed jurisdictions first
    const jurisdictions = await seedJurisdictionsData();
    
    // Seed governing bodies
    const governingBodies = await seedGoverningBodiesData(jurisdictions);
    
    // Seed offices
    const offices = await seedOfficesData(jurisdictions, governingBodies);
    
    // Seed districts
    const districts = await seedDistrictsData(jurisdictions);
    
    // Seed contact information
    await seedContactInfo(jurisdictions, governingBodies);
    
    console.log('🎉 Government data seeding completed successfully!');
    console.log(`📊 Created ${jurisdictions ? Object.keys(jurisdictions).length : 0} jurisdictions`);
    console.log(`📊 Created ${governingBodies ? Object.keys(governingBodies).length : 0} governing bodies`);
    console.log(`📊 Created ${offices ? Object.keys(offices).length : 0} offices`);
    console.log(`📊 Created ${districts.length} districts`);
    
  } catch (error) {
    console.error('❌ Error seeding government data:', error);
    throw error;
  }
}

// ------------------------------
// Export and Run
// ------------------------------

module.exports = { seedGovernmentData };

// Run if called directly
if (require.main === module) {
  seedGovernmentData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
