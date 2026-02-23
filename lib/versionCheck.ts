// Version check and cache clearing utility
// Automatically clears storage when a new deployment is detected

const VERSION_KEY = 'app_version';
const CURRENT_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || Date.now().toString();

export const clearAllStorage = () => {
  if (typeof window === 'undefined') return;

  try {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      // Clear for current domain
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      // Clear for root domain
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      // Clear for parent domain
      const domain = window.location.hostname.split('.').slice(-2).join('.');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
    });

    console.log('✅ All storage cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
  }
};

export const checkVersionAndClearStorage = () => {
  if (typeof window === 'undefined') return;

  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    
    // If version doesn't match or doesn't exist, clear everything
    if (storedVersion !== CURRENT_VERSION) {
      console.log(`🔄 New deployment detected (${storedVersion} → ${CURRENT_VERSION})`);
      console.log('🧹 Clearing all storage for fresh start...');
      
      clearAllStorage();
      
      // Set new version
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      
      console.log('✨ Storage cleared! Fresh start ready.');
      
      // Optional: Show a toast notification to user
      if (storedVersion) {
        // Only show if there was a previous version (not first visit)
        console.log('💡 App updated to latest version');
      }
    } else {
      console.log('✅ App version up to date');
    }
  } catch (error) {
    console.error('❌ Error checking version:', error);
  }
};

// Force clear function for manual use
export const forceCleanStorage = () => {
  console.log('🧹 Force clearing all storage...');
  clearAllStorage();
  if (typeof window !== 'undefined') {
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }
  console.log('✨ Force clear complete!');
};
