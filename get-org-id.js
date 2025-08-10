// Simple script to help get Vercel ORG_ID
// Run this locally with: node get-org-id.js

const https = require('https');

console.log('To get your ORG_ID, follow these steps:');
console.log('');
console.log('1. Go to: https://vercel.com/account');
console.log('2. Look for "Team ID" or "Organization ID"');
console.log('3. It will look like: team_xxxxxxxxxxxxxxxxxxxx');
console.log('');
console.log('OR');
console.log('');
console.log('1. Go to: https://vercel.com/dashboard');
console.log('2. Click your profile icon (top right)');
console.log('3. Click "Settings"');
console.log('4. Click "General" tab');
console.log('5. Look for "Team ID"');
console.log('');
console.log('The ORG_ID is required for GitHub Actions deployment.');
