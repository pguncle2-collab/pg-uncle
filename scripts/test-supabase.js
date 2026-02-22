#!/usr/bin/env node

/**
 * Quick Supabase Connection Test
 * Run: node scripts/test-supabase.js
 */

require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');

// Test 1: Check environment variables
console.log('1️⃣ Checking environment variables:');
console.log(`   URL: ${SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`   Key: ${SUPABASE_KEY ? '✅ Set' : '❌ Missing'}\n`);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing environment variables. Check your .env.local file.');
  process.exit(1);
}

// Test 2: Check if Supabase is reachable
console.log('2️⃣ Testing Supabase connection...');

const testConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('   ✅ Supabase is reachable');
      console.log(`   Status: ${response.status} ${response.statusText}\n`);
      return true;
    } else {
      console.log(`   ⚠️ Unexpected response: ${response.status} ${response.statusText}\n`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('   ❌ Connection timeout (5 seconds)');
      console.log('   💡 Your Supabase project may be paused.\n');
      console.log('   🔧 Fix: Go to https://supabase.com/dashboard');
      console.log('      Click your project and restore it if paused.\n');
    } else {
      console.log(`   ❌ Connection failed: ${error.message}\n`);
    }
    return false;
  }
};

// Test 3: Check Supabase status
console.log('3️⃣ Checking Supabase service status...');
const checkStatus = async () => {
  try {
    const response = await fetch('https://status.supabase.com/api/v2/status.json');
    const data = await response.json();
    console.log(`   Status: ${data.status.description}\n`);
  } catch (error) {
    console.log('   ⚠️ Could not check status\n');
  }
};

// Run tests
(async () => {
  await testConnection();
  await checkStatus();

  console.log('📋 Summary:');
  console.log('   If connection failed with timeout:');
  console.log('   1. Check if your Supabase project is paused');
  console.log('   2. Go to: https://supabase.com/dashboard');
  console.log('   3. Restore your project if needed');
  console.log('   4. Wait 1-2 minutes for it to wake up');
  console.log('   5. Run this test again\n');
})();
