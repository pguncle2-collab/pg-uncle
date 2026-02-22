/**
 * Performance Testing Script
 * 
 * This script helps you measure the actual performance improvement
 * after applying the optimizations.
 * 
 * HOW TO USE:
 * 1. Open your browser DevTools (F12)
 * 2. Go to Console tab
 * 3. Copy and paste this entire script
 * 4. Press Enter
 * 5. Check the results
 */

(async function testPerformance() {
  console.log('🚀 Starting Performance Test...\n');
  
  // Test 1: Check if caching is working
  console.log('📊 Test 1: Cache Performance');
  console.log('Loading properties for the first time...');
  
  const start1 = performance.now();
  // Trigger a page reload to test
  console.log('Please refresh the page (F5) and run this script again to test cache.');
  
  // Test 2: Check localStorage for cache
  console.log('\n📦 Test 2: Cache Storage');
  const cacheKeys = Object.keys(localStorage).filter(key => 
    key.includes('properties') || key.includes('cache')
  );
  
  if (cacheKeys.length > 0) {
    console.log('✅ Cache found in localStorage:');
    cacheKeys.forEach(key => {
      const data = localStorage.getItem(key);
      console.log(`  - ${key}: ${(data.length / 1024).toFixed(2)} KB`);
    });
  } else {
    console.log('⚠️ No cache found. This might be the first load.');
  }
  
  // Test 3: Check network requests
  console.log('\n🌐 Test 3: Network Performance');
  console.log('Open Network tab and filter by "supabase" to see:');
  console.log('  - Request time (should be < 500ms with indexes)');
  console.log('  - Response size (should be < 200KB)');
  console.log('  - Number of requests (should be minimal with cache)');
  
  // Test 4: Check image optimization
  console.log('\n🖼️ Test 4: Image Optimization');
  const images = document.querySelectorAll('img[src*="supabase"]');
  if (images.length > 0) {
    console.log(`✅ Found ${images.length} Supabase images`);
    images.forEach((img, i) => {
      const hasOptimization = img.src.includes('width=') || img.src.includes('quality=');
      console.log(`  Image ${i + 1}: ${hasOptimization ? '✅ Optimized' : '❌ Not optimized'}`);
    });
  } else {
    console.log('⚠️ No Supabase images found on page');
  }
  
  // Test 5: Measure page load time
  console.log('\n⏱️ Test 5: Page Load Performance');
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    
    console.log(`  - DOM Ready: ${domReady}ms`);
    console.log(`  - Full Load: ${loadTime}ms`);
    
    if (loadTime < 2000) {
      console.log('  ✅ Excellent! Load time under 2 seconds');
    } else if (loadTime < 3000) {
      console.log('  ⚠️ Good, but could be better. Check if indexes are created.');
    } else {
      console.log('  ❌ Slow. Make sure to run OPTIMIZE_DATABASE_INDEXES.sql');
    }
  }
  
  // Test 6: Check for loading skeleton
  console.log('\n💀 Test 6: Loading Skeleton');
  const hasSkeletonClass = document.querySelector('.animate-pulse');
  if (hasSkeletonClass) {
    console.log('✅ Loading skeleton is active (good UX)');
  } else {
    console.log('ℹ️ No skeleton visible (page already loaded)');
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 PERFORMANCE TEST SUMMARY');
  console.log('='.repeat(50));
  console.log('\nTo get accurate results:');
  console.log('1. Clear cache (Ctrl+Shift+Delete)');
  console.log('2. Reload page and measure first load');
  console.log('3. Reload again and measure cached load');
  console.log('4. Compare the two times');
  console.log('\nExpected Results:');
  console.log('  - First load: 1-2 seconds (with indexes)');
  console.log('  - Cached load: < 100ms');
  console.log('  - Image sizes: < 100KB each');
  console.log('\nIf not meeting expectations:');
  console.log('  1. Run OPTIMIZE_DATABASE_INDEXES.sql in Supabase');
  console.log('  2. Check if Supabase project is paused');
  console.log('  3. Verify network connection');
  console.log('\n✨ Test complete!\n');
})();

/**
 * ADVANCED: Measure API Response Time
 * 
 * Run this in Console to measure Supabase query time:
 */
async function measureQueryTime() {
  console.log('⏱️ Measuring Supabase query time...');
  
  const start = performance.now();
  
  try {
    const response = await fetch(
      `${window.location.origin}/api/properties`,
      { cache: 'no-store' }
    );
    
    const end = performance.now();
    const time = end - start;
    
    console.log(`\n📊 Query Results:`);
    console.log(`  - Response time: ${time.toFixed(2)}ms`);
    console.log(`  - Status: ${response.status}`);
    
    if (time < 500) {
      console.log('  ✅ Excellent! Query is fast (indexes working)');
    } else if (time < 1000) {
      console.log('  ⚠️ Acceptable, but could be faster');
    } else {
      console.log('  ❌ Slow! Run OPTIMIZE_DATABASE_INDEXES.sql');
    }
    
    const data = await response.json();
    const size = JSON.stringify(data).length;
    console.log(`  - Response size: ${(size / 1024).toFixed(2)} KB`);
    
    if (size < 200 * 1024) {
      console.log('  ✅ Good! Response size is optimized');
    } else {
      console.log('  ⚠️ Large response. Check if query is selective.');
    }
    
  } catch (error) {
    console.error('❌ Error measuring query time:', error);
  }
}

// Instructions
console.log('\n📖 HOW TO USE THIS SCRIPT:');
console.log('1. Copy the entire script');
console.log('2. Open DevTools Console (F12)');
console.log('3. Paste and press Enter');
console.log('4. To measure API time, run: measureQueryTime()');
console.log('\n');
