#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'prisma', 'queries', 'tools.ts');

console.log('🧹 Cleaning up @ts-ignore comments from tools.ts...');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove @ts-ignore comments related to Prisma migration
  content = content.replace(/\s*\/\/ @ts-ignore - Prisma client will be regenerated after migration\n/g, '');
  
  fs.writeFileSync(filePath, content);
  
  console.log('✅ Cleaned up @ts-ignore comments successfully!');
  console.log('🎉 Monthly usage tracking implementation is now complete.');
  
} catch (error) {
  console.error('❌ Failed to clean up @ts-ignore comments:', error.message);
  process.exit(1);
}