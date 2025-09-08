#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check environment
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;
const databaseUrl = process.env.DATABASE_URL;

console.log('🔍 Environment Check:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`DATABASE_URL: ${databaseUrl ? 'Set' : 'Not set'}`);

if (!isDevelopment) {
  console.log('❌ This script should only be run in development environment.');
  console.log('   Please set NODE_ENV=development or run this on your local database.');
  process.exit(1);
}

if (databaseUrl && databaseUrl.includes('supabase.com')) {
  console.log('❌ Detected production Supabase database.');
  console.log('   This script is for local development only.');
  console.log('   Please use a local database URL or apply the migration manually in production.');
  process.exit(1);
}

console.log('✅ Safe to proceed with migration.');

try {
  // Read the migration SQL
  const migrationPath = path.join(__dirname, '..', 'migrations', 'add_monthly_usage_tracking.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('📝 Applying migration...');
  
  // Apply the migration using Prisma
  execSync('npx prisma db execute --file migrations/add_monthly_usage_tracking.sql', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
  
  console.log('🔄 Regenerating Prisma client...');
  
  // Regenerate Prisma client
  execSync('npx prisma generate', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
  
  console.log('✅ Migration completed successfully!');
  console.log('🎉 Monthly usage tracking is now enabled.');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('📄 You can manually apply the migration using the SQL file:');
  console.log('   packages/database/migrations/add_monthly_usage_tracking.sql');
  process.exit(1);
}