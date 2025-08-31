#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Authentication System Environment Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('⚠️  .env file already exists. This script will not overwrite it.');
  console.log('   If you want to update your environment variables, please edit .env manually.\n');
} else {
  console.log('📝 Creating .env file with default values...\n');
  
  const envContent = `# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Google OAuth Configuration (Optional - for Google sign-in)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:3000

# Mapbox Configuration (if using maps)
# MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!\n');
}

console.log('📋 Next Steps:');
console.log('1. Update MONGODB_URI with your actual MongoDB connection string');
console.log('2. Generate a strong JWT_SECRET (you can use: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))")');
console.log('3. Generate a strong SESSION_SECRET (you can use: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")');
console.log('4. (Optional) Set up Google OAuth credentials and uncomment the Google OAuth variables');
console.log('\n🔗 For Google OAuth setup, see: /document/Authentication_System');
console.log('\n🚀 To start the development servers:');
console.log('   npm run server:dev  # Backend');
console.log('   npm run dev:ui      # Frontend');
