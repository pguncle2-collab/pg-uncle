'use client';

import { useEffect } from 'react';
import { checkVersionAndClearStorage } from '@/lib/versionCheck';

/**
 * VersionChecker Component
 * 
 * Automatically checks for new deployments and clears storage when detected.
 * This ensures users always get fresh data after updates.
 * 
 * Place this component in the root layout to run on every page load.
 */
export const VersionChecker: React.FC = () => {
  useEffect(() => {
    // Check version on mount
    checkVersionAndClearStorage();

    // Optional: Check periodically (every 5 minutes)
    const interval = setInterval(() => {
      checkVersionAndClearStorage();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // This component doesn't render anything
  return null;
};
