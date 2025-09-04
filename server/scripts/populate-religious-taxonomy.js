const mongoose = require('mongoose');
const { Identity } = require('../models/Identity/Identity');
const { connectDB } = require('../utils/database');
require('dotenv').config();

// Comprehensive religious taxonomy based on Pew Research and other sources
const religiousTaxonomy = [
  // Level 0: Top-level categories
  {
    id: 1,
    name: 'Christian',
    slug: 'christian',
    abbr: 'CHR',
    description: 'Individuals who identify as Christian',
    parentId: null,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 180000000 }
  },
  {
    id: 2,
    name: 'Non-Religious',
    slug: 'non-religious',
    abbr: 'NR',
    description: 'Individuals who do not identify with any organized religion',
    parentId: null,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 28000000 }
  },
  {
    id: 3,
    name: 'Jewish',
    slug: 'jewish',
    abbr: 'JEW',
    description: 'Individuals who identify as Jewish',
    parentId: null,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 7000000 }
  },
  {
    id: 4,
    name: 'Muslim',
    slug: 'muslim',
    abbr: 'MUS',
    description: 'Individuals who identify as Muslim',
    parentId: null,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 3500000 }
  },
  {
    id: 5,
    name: 'Buddhist',
    slug: 'buddhist',
    abbr: 'BUD',
    description: 'Individuals who identify as Buddhist',
    parentId: null,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 1200000 }
  },
  {
    id: 6,
    name: 'Hindu',
    slug: 'hindu',
    abbr: 'HIN',
    description: 'Individuals who identify as Hindu',
    parentId: null,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 800000 }
  },
  {
    id: 7,
    name: 'Other Religions',
    slug: 'other-religions',
    abbr: 'OTH',
    description: 'Individuals who identify with other religious traditions',
    parentId: null,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 2000000 }
  },

  // Level 1: Christian denominations
  {
    id: 11,
    name: 'Protestant',
    slug: 'protestant',
    abbr: 'PROT',
    description: 'Protestant Christians',
    parentId: 1,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 100000000 }
  },
  {
    id: 12,
    name: 'Catholic',
    slug: 'catholic',
    abbr: 'CATH',
    description: 'Roman Catholic Christians',
    parentId: 1,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 70000000 }
  },
  {
    id: 13,
    name: 'Orthodox',
    slug: 'orthodox',
    abbr: 'ORTH',
    description: 'Eastern Orthodox Christians',
    parentId: 1,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 10000000 }
  },

  // Level 1: Non-Religious subcategories
  {
    id: 21,
    name: 'Agnostic',
    slug: 'agnostic',
    abbr: 'AGN',
    description: 'Individuals who are uncertain about the existence of God',
    parentId: 2,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 15000000 }
  },
  {
    id: 22,
    name: 'Atheist',
    slug: 'atheist',
    abbr: 'ATH',
    description: 'Individuals who do not believe in the existence of God',
    parentId: 2,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 13000000 }
  },

  // Level 1: Jewish denominations
  {
    id: 31,
    name: 'Reform Judaism',
    slug: 'reform-judaism',
    abbr: 'REF',
    description: 'Reform Jewish denomination',
    parentId: 3,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 3500000 }
  },
  {
    id: 32,
    name: 'Conservative Judaism',
    slug: 'conservative-judaism',
    abbr: 'CON',
    description: 'Conservative Jewish denomination',
    parentId: 3,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 1500000 }
  },
  {
    id: 33,
    name: 'Orthodox Judaism',
    slug: 'orthodox-judaism',
    abbr: 'ORTH',
    description: 'Orthodox Jewish denomination',
    parentId: 3,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 1000000 }
  },
  {
    id: 34,
    name: 'Secular/Cultural Jewish',
    slug: 'secular-cultural-jewish',
    abbr: 'SEC',
    description: 'Secular or culturally Jewish individuals',
    parentId: 3,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 1000000 }
  },

  // Level 1: Muslim denominations
  {
    id: 41,
    name: 'Sunni Islam',
    slug: 'sunni-islam',
    abbr: 'SUN',
    description: 'Sunni Muslim denomination',
    parentId: 4,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 2800000 }
  },
  {
    id: 42,
    name: 'Shia Islam',
    slug: 'shia-islam',
    abbr: 'SHI',
    description: 'Shia Muslim denomination',
    parentId: 4,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 700000 }
  },

  // Level 1: Buddhist traditions
  {
    id: 51,
    name: 'Theravada Buddhism',
    slug: 'theravada-buddhism',
    abbr: 'THE',
    description: 'Theravada Buddhist tradition',
    parentId: 5,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 400000 }
  },
  {
    id: 52,
    name: 'Mahayana Buddhism',
    slug: 'mahayana-buddhism',
    abbr: 'MAH',
    description: 'Mahayana Buddhist tradition',
    parentId: 5,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 500000 }
  },
  {
    id: 53,
    name: 'Vajrayana Buddhism',
    slug: 'vajrayana-buddhism',
    abbr: 'VAJ',
    description: 'Vajrayana Buddhist tradition',
    parentId: 5,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 300000 }
  },

  // Level 2: Protestant denominations
  {
    id: 111,
    name: 'Baptist',
    slug: 'baptist',
    abbr: 'BAP',
    description: 'Baptist Protestant denomination',
    parentId: 11,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 30000000 }
  },
  {
    id: 112,
    name: 'Methodist',
    slug: 'methodist',
    abbr: 'MET',
    description: 'Methodist Protestant denomination',
    parentId: 11,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 12000000 }
  },
  {
    id: 113,
    name: 'Lutheran',
    slug: 'lutheran',
    abbr: 'LUT',
    description: 'Lutheran Protestant denomination',
    parentId: 11,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 8000000 }
  },
  {
    id: 114,
    name: 'Presbyterian',
    slug: 'presbyterian',
    abbr: 'PRE',
    description: 'Presbyterian Protestant denomination',
    parentId: 11,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 5000000 }
  },
  {
    id: 115,
    name: 'Pentecostal',
    slug: 'pentecostal',
    abbr: 'PEN',
    description: 'Pentecostal Protestant denomination',
    parentId: 11,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 15000000 }
  },
  {
    id: 116,
    name: 'Episcopal/Anglican',
    slug: 'episcopal-anglican',
    abbr: 'EPI',
    description: 'Episcopal/Anglican Protestant denomination',
    parentId: 11,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 3000000 }
  },
  {
    id: 117,
    name: 'Non-denominational Protestant',
    slug: 'non-denominational-protestant',
    abbr: 'NDP',
    description: 'Non-denominational Protestant Christians',
    parentId: 11,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 20000000 }
  },
  {
    id: 118,
    name: 'Other Protestant',
    slug: 'other-protestant',
    abbr: 'OPR',
    description: 'Other Protestant denominations',
    parentId: 11,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 7000000 }
  },

  // Level 2: Orthodox denominations
  {
    id: 131,
    name: 'Greek Orthodox',
    slug: 'greek-orthodox',
    abbr: 'GRO',
    description: 'Greek Orthodox denomination',
    parentId: 13,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 5000000 }
  },
  {
    id: 132,
    name: 'Russian Orthodox',
    slug: 'russian-orthodox',
    abbr: 'RUS',
    description: 'Russian Orthodox denomination',
    parentId: 13,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 2000000 }
  },
  {
    id: 133,
    name: 'Other Orthodox',
    slug: 'other-orthodox',
    abbr: 'OOR',
    description: 'Other Orthodox denominations',
    parentId: 13,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 3000000 }
  },

  // Level 2: Other Religions
  {
    id: 71,
    name: 'Sikh',
    slug: 'sikh',
    abbr: 'SIK',
    description: 'Sikh religious tradition',
    parentId: 7,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 500000 }
  },
  {
    id: 72,
    name: 'Jain',
    slug: 'jain',
    abbr: 'JAI',
    description: 'Jain religious tradition',
    parentId: 7,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 100000 }
  },
  {
    id: 73,
    name: 'Bahá\'í',
    slug: 'bahai',
    abbr: 'BAH',
    description: 'Bahá\'í religious tradition',
    parentId: 7,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 200000 }
  },
  {
    id: 74,
    name: 'Unitarian Universalist',
    slug: 'unitarian-universalist',
    abbr: 'UU',
    description: 'Unitarian Universalist tradition',
    parentId: 7,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 300000 }
  },
  {
    id: 75,
    name: 'Native American/Indigenous',
    slug: 'native-american-indigenous',
    abbr: 'NAI',
    description: 'Native American and Indigenous religious traditions',
    parentId: 7,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 400000 }
  },
  {
    id: 76,
    name: 'Wicca/Pagan',
    slug: 'wicca-pagan',
    abbr: 'WIC',
    description: 'Wicca and Pagan religious traditions',
    parentId: 7,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 500000 }
  },

  // Level 3: Baptist denominations
  {
    id: 1111,
    name: 'Southern Baptist',
    slug: 'southern-baptist',
    abbr: 'SBC',
    description: 'Southern Baptist Convention',
    parentId: 111,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 15000000 }
  },
  {
    id: 1112,
    name: 'American Baptist',
    slug: 'american-baptist',
    abbr: 'ABC',
    description: 'American Baptist Churches USA',
    parentId: 111,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 5000000 }
  },
  {
    id: 1113,
    name: 'Independent Baptist',
    slug: 'independent-baptist',
    abbr: 'IBP',
    description: 'Independent Baptist churches',
    parentId: 111,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 8000000 }
  },
  {
    id: 1114,
    name: 'Other Baptist',
    slug: 'other-baptist',
    abbr: 'OBP',
    description: 'Other Baptist denominations',
    parentId: 111,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 2000000 }
  },

  // Level 3: Pentecostal denominations
  {
    id: 1151,
    name: 'Assemblies of God',
    slug: 'assemblies-of-god',
    abbr: 'AOG',
    description: 'Assemblies of God Pentecostal denomination',
    parentId: 115,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 3000000 }
  },
  {
    id: 1152,
    name: 'Church of God in Christ',
    slug: 'church-of-god-in-christ',
    abbr: 'COG',
    description: 'Church of God in Christ Pentecostal denomination',
    parentId: 115,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 2000000 }
  },
  {
    id: 1153,
    name: 'Foursquare Gospel',
    slug: 'foursquare-gospel',
    abbr: 'FSG',
    description: 'International Church of the Foursquare Gospel',
    parentId: 115,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 1000000 }
  },
  {
    id: 1154,
    name: 'Other Pentecostal',
    slug: 'other-pentecostal',
    abbr: 'OPN',
    description: 'Other Pentecostal denominations',
    parentId: 115,
    populationEstimate: { year: 2025, source: 'Pew Research', estimate: 9000000 }
  }
];

// Function to populate the database
const populateReligiousTaxonomy = async () => {
  try {
    console.log('Starting to populate religious taxonomy...');
    
    // Clear existing religious identities
    await Identity.deleteMany({ identityType: 'ReligiousIdentity' });
    console.log('Cleared existing religious identities');
    
    // Insert new religious identities using upsert to handle conflicts
    for (const identity of religiousTaxonomy) {
      try {
        await Identity.findOneAndUpdate(
          { id: identity.id },
          {
            ...identity
          },
          { 
            upsert: true, 
            new: true,
            setDefaultsOnInsert: true
          }
        );
        console.log(`Created/Updated: ${identity.name} (ID: ${identity.id})`);
      } catch (error) {
        console.error(`Error creating ${identity.name}:`, error.message);
      }
    }
    
    console.log(`Successfully populated ${religiousTaxonomy.length} religious identities`);
    
    // Display the taxonomy structure
    console.log('\nReligious Taxonomy Structure:');
    console.log('============================');
    
    const topLevel = religiousTaxonomy.filter(item => item.parentId === null);
    for (const top of topLevel) {
      console.log(`\n${top.name} (${top.abbr})`);
      
      const level1 = religiousTaxonomy.filter(item => item.parentId === top.id);
      for (const l1 of level1) {
        console.log(`  └── ${l1.name} (${l1.abbr})`);
        
        const level2 = religiousTaxonomy.filter(item => item.parentId === l1.id);
        for (const l2 of level2) {
          console.log(`      └── ${l2.name} (${l2.abbr})`);
          
          const level3 = religiousTaxonomy.filter(item => item.parentId === l2.id);
          for (const l3 of level3) {
            console.log(`          └── ${l3.name} (${l3.abbr})`);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error populating religious taxonomy:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await populateReligiousTaxonomy();
  await mongoose.connection.close();
  console.log('\nDatabase connection closed');
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { religiousTaxonomy, populateReligiousTaxonomy };
