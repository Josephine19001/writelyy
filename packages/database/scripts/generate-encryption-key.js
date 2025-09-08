#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Generating INTEGRATION_ENCRYPTION_KEY...\n');

// Generate 32-byte (256-bit) encryption key
const encryptionKey = crypto.randomBytes(32).toString('hex');

console.log('Generated encryption key:');
console.log('INTEGRATION_ENCRYPTION_KEY=' + encryptionKey);
console.log('\n✅ Key length:', encryptionKey.length, 'characters (64 hex characters = 32 bytes)');

// Try to find .env file and offer to add it
const projectRoot = path.resolve(__dirname, '../../../');
const envPath = path.join(projectRoot, '.env');

if (fs.existsSync(envPath)) {
  console.log('\n📝 Found .env file at:', envPath);
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('INTEGRATION_ENCRYPTION_KEY=')) {
    console.log('⚠️  INTEGRATION_ENCRYPTION_KEY already exists in .env file');
    console.log('   Please update it manually if needed');
  } else {
    console.log('➕ Adding INTEGRATION_ENCRYPTION_KEY to .env file...');
    
    const newContent = envContent + (envContent.endsWith('\n') ? '' : '\n') + 
                      `INTEGRATION_ENCRYPTION_KEY=${encryptionKey}\n`;
    
    fs.writeFileSync(envPath, newContent);
    console.log('✅ Successfully added INTEGRATION_ENCRYPTION_KEY to .env file');
  }
} else {
  console.log('\n⚠️  No .env file found at project root');
  console.log('   Please create a .env file and add the key manually:');
  console.log('   INTEGRATION_ENCRYPTION_KEY=' + encryptionKey);
}

console.log('\n🔒 Security reminders:');
console.log('   • Keep this key secret and secure');
console.log('   • Never commit this key to version control');  
console.log('   • Use the same key across environments that share data');
console.log('   • Changing this key will make existing encrypted data unreadable');