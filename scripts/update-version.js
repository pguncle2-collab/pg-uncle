#!/usr/bin/env node

/**
 * Version Update Script
 * 
 * Updates the app version in .env.local for deployment
 * 
 * Usage:
 *   node scripts/update-version.js          # Auto-generate timestamp version
 *   node scripts/update-version.js 1.0.1    # Set specific version
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

// Get version from command line or generate timestamp
const newVersion = process.argv[2] || new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);

try {
  let envContent = '';
  
  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add version
  if (envContent.includes('NEXT_PUBLIC_APP_VERSION=')) {
    // Replace existing version
    envContent = envContent.replace(
      /NEXT_PUBLIC_APP_VERSION=.*/,
      `NEXT_PUBLIC_APP_VERSION=${newVersion}`
    );
  } else {
    // Add new version
    envContent += `\n# App Version\nNEXT_PUBLIC_APP_VERSION=${newVersion}\n`;
  }

  // Write back to file
  fs.writeFileSync(envPath, envContent);

  console.log('✅ Version updated successfully!');
  console.log(`📦 New version: ${newVersion}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Commit the changes: git add .env.local');
  console.log('2. Deploy your application');
  console.log('3. Users will automatically get fresh storage on next visit');
} catch (error) {
  console.error('❌ Error updating version:', error.message);
  process.exit(1);
}
