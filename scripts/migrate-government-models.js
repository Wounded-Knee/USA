#!/usr/bin/env node

/**
 * Government Database Model Migration Script
 * 
 * This script migrates existing government data to be compatible with the enhanced
 * database models that include proper relationships, district references, and validation.
 * 
 * Run with: node scripts/migrate-government-models.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const { 
  Jurisdiction, 
  GoverningBody, 
  Office, 
  Position, 
  Election,
  Legislation,
  GovernmentVote,
  Committee,
  District,
  ContactInfo
} = require('../server/models/Government')

// MongoDB connection string - use environment variable
const MONGODB_URI = process.env.MONGODB_URI

async function connectToDatabase() {
  try {
    // Check if MONGODB_URI is provided
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables.')
      console.error('📝 Please create a .env file with your MongoDB Atlas connection string.')
      console.error('📋 Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority')
      process.exit(1)
    }

    const conn = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`)
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error)
  }
}

/**
 * Migration 1: Fix Office model relationships
 * - Ensure offices have either governing_body OR jurisdiction, not both
 * - Add missing district references where appropriate
 */
async function migrateOfficeRelationships() {
  console.log('\n🔄 Migrating Office relationships...')
  
  try {
    const offices = await Office.find({})
    let updatedCount = 0
    let errorCount = 0
    
    for (const office of offices) {
      try {
        let needsUpdate = false
        const updates = {}
        
        // Check if office has both governing_body and jurisdiction
        if (office.governing_body && office.jurisdiction) {
          console.log(`⚠️  Office "${office.name}" has both governing_body and jurisdiction. Removing jurisdiction.`)
          updates.jurisdiction = undefined
          needsUpdate = true
        }
        
        // Check if office has neither governing_body nor jurisdiction
        if (!office.governing_body && !office.jurisdiction) {
          console.log(`⚠️  Office "${office.name}" has neither governing_body nor jurisdiction. This needs manual review.`)
          errorCount++
          continue
        }
        
        // Add district reference if missing and office is district-based
        if (office.constituency === 'district_based' && !office.district) {
          console.log(`⚠️  Office "${office.name}" is district-based but has no district reference. This needs manual review.`)
          errorCount++
          continue
        }
        
        if (needsUpdate) {
          await Office.findByIdAndUpdate(office._id, updates, { runValidators: true })
          updatedCount++
        }
      } catch (error) {
        console.error(`❌ Error updating office "${office.name}":`, error.message)
        errorCount++
      }
    }
    
    console.log(`✅ Office migration completed: ${updatedCount} updated, ${errorCount} errors`)
  } catch (error) {
    console.error('❌ Error during office migration:', error)
  }
}

/**
 * Migration 2: Add missing district references to elections
 */
async function migrateElectionDistricts() {
  console.log('\n🔄 Migrating Election districts...')
  
  try {
    const elections = await Election.find({})
    let updatedCount = 0
    let errorCount = 0
    
    for (const election of elections) {
      try {
        // If election has an office, try to get district from the office
        if (election.office && !election.district) {
          const office = await Office.findById(election.office)
          if (office && office.district) {
            await Election.findByIdAndUpdate(election._id, { district: office.district })
            console.log(`✅ Added district reference to election for office "${office.name}"`)
            updatedCount++
          }
        }
      } catch (error) {
        console.error(`❌ Error updating election:`, error.message)
        errorCount++
      }
    }
    
    console.log(`✅ Election migration completed: ${updatedCount} updated, ${errorCount} errors`)
  } catch (error) {
    console.error('❌ Error during election migration:', error)
  }
}

/**
 * Migration 3: Add missing position references to votes
 */
async function migrateVotePositions() {
  console.log('\n🔄 Migrating Vote positions...')
  
  try {
    const votes = await GovernmentVote.find({ position: { $exists: false } })
    let updatedCount = 0
    let errorCount = 0
    
    for (const vote of votes) {
      try {
        // Try to find a position for this person and governing body
        const position = await Position.findOne({
          person: vote.person,
          governing_body: vote.governing_body,
          is_current: true
        })
        
        if (position) {
          await GovernmentVote.findByIdAndUpdate(vote._id, { position: position._id })
          console.log(`✅ Added position reference to vote for person ${vote.person}`)
          updatedCount++
        } else {
          console.log(`⚠️  No current position found for vote by person ${vote.person}`)
          errorCount++
        }
      } catch (error) {
        console.error(`❌ Error updating vote:`, error.message)
        errorCount++
      }
    }
    
    console.log(`✅ Vote migration completed: ${updatedCount} updated, ${errorCount} errors`)
  } catch (error) {
    console.error('❌ Error during vote migration:', error)
  }
}

/**
 * Migration 4: Add missing election references to positions
 */
async function migratePositionElections() {
  console.log('\n🔄 Migrating Position elections...')
  
  try {
    const positions = await Position.find({ election: { $exists: false } })
    let updatedCount = 0
    let errorCount = 0
    
    for (const position of positions) {
      try {
        // Try to find an election for this office around the term start date
        const election = await Election.findOne({
          office: position.office,
          election_date: {
            $gte: new Date(position.term_start.getTime() - 365 * 24 * 60 * 60 * 1000), // 1 year before
            $lte: new Date(position.term_start.getTime() + 365 * 24 * 60 * 60 * 1000)  // 1 year after
          }
        })
        
        if (election) {
          await Position.findByIdAndUpdate(position._id, { election: election._id })
          console.log(`✅ Added election reference to position for office ${position.office}`)
          updatedCount++
        } else {
          console.log(`⚠️  No election found for position in office ${position.office}`)
          errorCount++
        }
      } catch (error) {
        console.error(`❌ Error updating position:`, error.message)
        errorCount++
      }
    }
    
    console.log(`✅ Position migration completed: ${updatedCount} updated, ${errorCount} errors`)
  } catch (error) {
    console.error('❌ Error during position migration:', error)
  }
}

/**
 * Migration 5: Validate and fix date constraints
 */
async function validateDateConstraints() {
  console.log('\n🔄 Validating date constraints...')
  
  try {
    // Check positions with invalid term dates
    const invalidPositions = await Position.find({
      term_end: { $exists: true, $ne: null },
      $expr: { $lte: ['$term_end', '$term_start'] }
    })
    
    if (invalidPositions.length > 0) {
      console.log(`⚠️  Found ${invalidPositions.length} positions with invalid term dates (end <= start)`)
      for (const position of invalidPositions) {
        console.log(`   - Position ${position._id}: ${position.term_start} to ${position.term_end}`)
      }
    }
    
    // Check completed elections with future dates
    const invalidElections = await Election.find({
      status: 'completed',
      election_date: { $gt: new Date() }
    })
    
    if (invalidElections.length > 0) {
      console.log(`⚠️  Found ${invalidElections.length} completed elections with future dates`)
      for (const election of invalidElections) {
        console.log(`   - Election ${election._id}: ${election.election_date}`)
      }
    }
    
    console.log('✅ Date constraint validation completed')
  } catch (error) {
    console.error('❌ Error during date validation:', error)
  }
}

/**
 * Migration 6: Create sample districts if none exist
 */
async function createSampleDistricts() {
  console.log('\n🔄 Creating sample districts...')
  
  try {
    const districtCount = await District.countDocuments()
    
    if (districtCount === 0) {
      console.log('No districts found. Creating sample districts...')
      
      // Get a sample jurisdiction (United States)
      const usaJurisdiction = await Jurisdiction.findOne({ name: 'United States of America' })
      
      if (usaJurisdiction) {
        const sampleDistricts = [
          {
            name: 'Congressional District 1',
            district_type: 'congressional',
            district_number: 1,
            jurisdiction: usaJurisdiction._id,
            description: 'Sample congressional district',
            population: 750000
          },
          {
            name: 'Congressional District 2',
            district_type: 'congressional',
            district_number: 2,
            jurisdiction: usaJurisdiction._id,
            description: 'Sample congressional district',
            population: 750000
          }
        ]
        
        for (const districtData of sampleDistricts) {
          const district = new District(districtData)
          await district.save()
          console.log(`✅ Created district: ${district.name}`)
        }
      } else {
        console.log('⚠️  No United States jurisdiction found. Skipping sample district creation.')
      }
    } else {
      console.log(`✅ Found ${districtCount} existing districts`)
    }
  } catch (error) {
    console.error('❌ Error creating sample districts:', error)
  }
}

/**
 * Main migration function
 */
async function runMigrations() {
  console.log('🚀 Starting Government Database Model Migrations...')
  
  try {
    await connectToDatabase()
    
    // Run migrations in order
    await migrateOfficeRelationships()
    await migrateElectionDistricts()
    await migrateVotePositions()
    await migratePositionElections()
    await validateDateConstraints()
    await createSampleDistricts()
    
    console.log('\n✅ All migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await disconnectFromDatabase()
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations()
}

module.exports = {
  runMigrations,
  migrateOfficeRelationships,
  migrateElectionDistricts,
  migrateVotePositions,
  migratePositionElections,
  validateDateConstraints,
  createSampleDistricts
}
