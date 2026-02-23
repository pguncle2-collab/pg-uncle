# Deployment Guide

This guide explains how to deploy PGUNCLE with automatic cache clearing.

## Automatic Storage Clearing on Deployment

The app automatically clears localStorage, sessionStorage, and cookies when a new deployment is detected. This ensures users always get fresh data after updates.

### How It Works

1. **Version Tracking**: Each deployment has a unique version identifier
2. **Automatic Detection**: On page load, the app checks if the version has changed
3. **Storage Clearing**: If a new version is detected, all storage is cleared
4. **Fresh Start**: Users get the latest data without manual cache clearing

### Setting Up Version Control

#### Option 1: Manual Version (Recommended for Production)

Update the version in your `.env.local` or deployment environment:

```bash
NEXT_PUBLIC_APP_VERSION=1.0.0
```

**When to update:**
- Before each production deployment
- Use semantic versioning (1.0.0, 1.0.1, 1.1.0, etc.)
- Or use date-based versioning (20250224-1430)

#### Option 2: Automatic Version (CI/CD)

The app automatically uses the current timestamp if no version is set. This works well with CI/CD pipelines.

**For Vercel:**
```bash
# In your vercel.json or project settings
NEXT_PUBLIC_APP_VERSION=$VERCEL_GIT_COMMIT_SHA
```

**For GitHub Actions:**
```yaml
- name: Deploy
  env:
    NEXT_PUBLIC_APP_VERSION: ${{ github.sha }}
  run: npm run build
```

**For other platforms:**
```bash
# Use git commit hash
NEXT_PUBLIC_APP_VERSION=$(git rev-parse --short HEAD)

# Or use timestamp
NEXT_PUBLIC_APP_VERSION=$(date +%Y%m%d-%H%M)
```

## Deployment Checklist

### Before Deployment

1. ✅ Update `NEXT_PUBLIC_APP_VERSION` in environment variables
2. ✅ Test the build locally: `npm run build`
3. ✅ Verify all environment variables are set
4. ✅ Check for TypeScript errors: `npm run type-check`
5. ✅ Review recent changes in git

### During Deployment

1. Push to your deployment branch (main/production)
2. Monitor build logs for errors
3. Wait for deployment to complete

### After Deployment

1. ✅ Visit the site and check browser console for version message
2. ✅ Verify storage was cleared (check Application tab in DevTools)
3. ✅ Test critical user flows:
   - Property browsing
   - Booking flow
   - Contact form
   - Authentication
4. ✅ Check Google Analytics for events

## Platform-Specific Instructions

### Vercel

1. Go to Project Settings → Environment Variables
2. Add/Update: `NEXT_PUBLIC_APP_VERSION=1.0.0`
3. Redeploy the project

### Netlify

1. Go to Site Settings → Build & Deploy → Environment
2. Add/Update: `NEXT_PUBLIC_APP_VERSION=1.0.0`
3. Trigger a new deploy

### Custom Server

```bash
# Set environment variable
export NEXT_PUBLIC_APP_VERSION=1.0.0

# Build and start
npm run build
npm start
```

## Manual Storage Clearing

If you need to manually clear storage for testing:

```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Or use the force clear function:

```javascript
// Import in your component
import { forceCleanStorage } from '@/lib/versionCheck';

// Call when needed
forceCleanStorage();
```

## Troubleshooting

### Storage Not Clearing

1. Check if `NEXT_PUBLIC_APP_VERSION` is set correctly
2. Verify the VersionChecker component is in the layout
3. Check browser console for version check messages
4. Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Users Seeing Old Data

1. Ensure version was updated before deployment
2. Check if service workers are caching old content
3. Verify CDN cache is cleared (if using one)
4. Ask users to hard refresh their browser

### Version Not Updating

1. Clear your local `.next` folder: `rm -rf .next`
2. Rebuild: `npm run build`
3. Check environment variables are loaded correctly
4. Verify the version in browser console

## Best Practices

1. **Semantic Versioning**: Use meaningful version numbers (1.0.0, 1.1.0, 2.0.0)
2. **Document Changes**: Keep a CHANGELOG.md with version updates
3. **Test Before Deploy**: Always test in staging environment first
4. **Monitor After Deploy**: Watch for errors in production logs
5. **Gradual Rollout**: Consider using feature flags for major changes

## Version History

Keep track of your deployments:

```
v1.0.0 - 2024-02-24
- Initial production release
- Google Analytics integration
- Automatic storage clearing

v1.0.1 - 2024-02-25
- Bug fixes
- Performance improvements
```

## Emergency Rollback

If you need to rollback:

1. Revert to previous version in your deployment platform
2. Update `NEXT_PUBLIC_APP_VERSION` to previous value
3. Redeploy
4. Storage will be cleared again for users

## Support

For issues or questions:
- Check browser console for error messages
- Review deployment logs
- Contact: info@pguncle.com
