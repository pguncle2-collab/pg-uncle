# Automatic Cache Clearing System

## Overview

PGUNCLE includes an automatic cache clearing system that ensures users always get fresh data after deployments. This eliminates common issues with stale data, outdated UI, and cached API responses.

## What Gets Cleared

When a new deployment is detected, the system automatically clears:

1. **localStorage** - All stored data including user preferences
2. **sessionStorage** - Temporary session data
3. **Cookies** - All browser cookies (including auth cookies)

## How It Works

### 1. Version Tracking

Each deployment has a unique version identifier stored in:
```
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Automatic Detection

The `VersionChecker` component runs on every page load:
- Checks the stored version against the current deployment version
- If versions don't match, triggers storage clearing
- Updates the stored version to the new one

### 3. User Experience

Users experience:
- Seamless updates without manual cache clearing
- No need to hard refresh (Ctrl+Shift+R)
- Automatic logout (since auth cookies are cleared)
- Fresh data on next page load

## Implementation Details

### Files

1. **lib/versionCheck.ts** - Core logic for version checking and storage clearing
2. **components/VersionChecker.tsx** - React component that runs the check
3. **app/layout.tsx** - Includes VersionChecker in root layout

### Code Flow

```typescript
// On page load
VersionChecker mounts
  ↓
checkVersionAndClearStorage() runs
  ↓
Compare stored version vs current version
  ↓
If different:
  - Clear localStorage
  - Clear sessionStorage
  - Clear all cookies
  - Store new version
  ↓
User gets fresh start
```

## Usage

### For Developers

**Before deployment:**
```bash
# Update version automatically
npm run update-version

# Or set specific version
npm run update-version 1.0.1

# Build and deploy
npm run build
```

**Or use combined command:**
```bash
npm run deploy
```

### For CI/CD

**GitHub Actions:**
```yaml
- name: Set Version
  run: echo "NEXT_PUBLIC_APP_VERSION=${{ github.sha }}" >> $GITHUB_ENV

- name: Build
  run: npm run build
```

**Vercel:**
```bash
# In project settings
NEXT_PUBLIC_APP_VERSION=$VERCEL_GIT_COMMIT_SHA
```

## Version Strategies

### 1. Semantic Versioning (Recommended)
```
1.0.0 - Initial release
1.0.1 - Bug fixes
1.1.0 - New features
2.0.0 - Breaking changes
```

### 2. Date-Based Versioning
```
20250224-1430 - Feb 24, 2025 at 2:30 PM
20250225-0900 - Feb 25, 2025 at 9:00 AM
```

### 3. Git Commit Hash
```
a1b2c3d - Short commit hash
a1b2c3d4e5f6g7h8 - Full commit hash
```

### 4. Automatic Timestamp (Default)
If no version is set, uses current timestamp automatically.

## Testing

### Manual Testing

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for version check messages:
   ```
   ✅ App version up to date
   ```
   or
   ```
   🔄 New deployment detected (1.0.0 → 1.0.1)
   🧹 Clearing all storage for fresh start...
   ✨ Storage cleared! Fresh start ready.
   ```

### Verify Storage Cleared

1. Open DevTools → Application tab
2. Check:
   - Local Storage (should be empty except app_version)
   - Session Storage (should be empty)
   - Cookies (should be cleared)

### Force Clear for Testing

In browser console:
```javascript
// Import and use force clear
import { forceCleanStorage } from '@/lib/versionCheck';
forceCleanStorage();
```

Or manually:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Benefits

### For Users
- ✅ Always see latest content
- ✅ No stale data issues
- ✅ No manual cache clearing needed
- ✅ Consistent experience across devices

### For Developers
- ✅ No support tickets about "old version"
- ✅ Easier debugging (everyone on same version)
- ✅ Faster feature rollout
- ✅ Reduced cache-related bugs

### For Business
- ✅ Better user experience
- ✅ Faster adoption of new features
- ✅ Reduced support costs
- ✅ More reliable analytics

## Common Scenarios

### Scenario 1: New Feature Deployment
```
1. Developer updates version to 1.1.0
2. Deploys to production
3. User visits site
4. Storage cleared automatically
5. User sees new features immediately
```

### Scenario 2: Bug Fix Deployment
```
1. Developer fixes bug, updates to 1.0.1
2. Deploys to production
3. User visits site
4. Old cached data cleared
5. Bug fix takes effect immediately
```

### Scenario 3: Emergency Rollback
```
1. Issue detected in production
2. Rollback to previous version
3. Update version back to 1.0.0
4. Users get cleared storage again
5. Back to stable state
```

## Troubleshooting

### Storage Not Clearing

**Check:**
1. Is `NEXT_PUBLIC_APP_VERSION` set?
2. Is VersionChecker in layout?
3. Check browser console for errors
4. Try hard refresh once

**Solution:**
```bash
# Verify version is set
echo $NEXT_PUBLIC_APP_VERSION

# Rebuild
npm run build
```

### Users Still Seeing Old Data

**Possible causes:**
1. CDN caching (clear CDN cache)
2. Service worker caching (update SW)
3. Browser extension interference
4. Version not updated before deploy

**Solution:**
```bash
# Ensure version is updated
npm run update-version
npm run build

# Clear CDN cache (if applicable)
# Vercel: Automatic
# Cloudflare: Purge cache
# Custom: Clear your CDN
```

### Version Not Updating

**Check:**
1. Environment variable loaded correctly
2. Build includes new version
3. Deployment successful

**Solution:**
```bash
# Check if version is in build
grep -r "NEXT_PUBLIC_APP_VERSION" .next/

# Rebuild from scratch
rm -rf .next
npm run build
```

## Best Practices

1. **Always Update Version Before Deploy**
   ```bash
   npm run update-version
   ```

2. **Use Meaningful Versions**
   - Semantic versioning for releases
   - Date-based for hotfixes
   - Git hash for CI/CD

3. **Test in Staging First**
   - Deploy to staging
   - Verify storage clearing works
   - Then deploy to production

4. **Monitor After Deploy**
   - Check error logs
   - Monitor analytics
   - Watch for user reports

5. **Document Version Changes**
   - Keep CHANGELOG.md updated
   - Note what changed in each version
   - Track deployment dates

## Advanced Configuration

### Disable for Development

```typescript
// lib/versionCheck.ts
export const checkVersionAndClearStorage = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️ Version check disabled in development');
    return;
  }
  // ... rest of code
};
```

### Custom Clear Logic

```typescript
// lib/versionCheck.ts
export const clearAllStorage = () => {
  // Keep certain items
  const keepItems = ['user_preferences', 'theme'];
  const savedData: Record<string, string> = {};
  
  keepItems.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) savedData[key] = value;
  });
  
  // Clear everything
  localStorage.clear();
  
  // Restore kept items
  Object.entries(savedData).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
};
```

### Periodic Checks

```typescript
// components/VersionChecker.tsx
useEffect(() => {
  // Check every 5 minutes
  const interval = setInterval(() => {
    checkVersionAndClearStorage();
  }, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

## Security Considerations

1. **Auth Tokens**: Cleared automatically (users need to re-login)
2. **Sensitive Data**: All cleared, no data leakage
3. **Third-party Cookies**: Cleared based on domain
4. **Session Data**: Completely removed

## Performance Impact

- **Minimal**: Check runs once on page load
- **Fast**: Storage clearing is instant
- **No Blocking**: Doesn't block page rendering
- **Efficient**: Only clears when version changes

## Support

For issues or questions:
- Check browser console for error messages
- Review deployment logs
- Test in incognito mode
- Contact: info@pguncle.com
