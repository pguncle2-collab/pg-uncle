# Supabase Auto-Pause Solution

## Problem
Supabase free tier projects pause after 7 days of inactivity, causing database connection errors.

## Solution Implemented

### 1. Code Improvements
- ✅ Simplified Supabase client initialization
- ✅ Automatic stale session cleanup on app load
- ✅ Direct REST API as primary fetch method (faster, more reliable)
- ✅ Supabase client as fallback
- ✅ Automatic retry on errors
- ✅ Better error handling and messages

### 2. Prevent Auto-Pause (Required)

Your app has a health check endpoint at: `/api/health`

**Set up a free ping service to keep Supabase awake:**

#### Option A: UptimeRobot (Recommended)
1. Go to https://uptimerobot.com
2. Create free account
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: `https://your-domain.com/api/health`
   - Interval: 5 minutes
4. Save

#### Option B: Cron-Job.org
1. Go to https://cron-job.org
2. Create free account
3. Create cron job:
   - URL: `https://your-domain.com/api/health`
   - Schedule: Every 5 minutes
4. Save

#### Option C: Better Uptime (Free)
1. Go to https://betteruptime.com
2. Create free account
3. Add monitor:
   - URL: `https://your-domain.com/api/health`
   - Check frequency: 3 minutes
4. Save

**This prevents Supabase from pausing by keeping it active.**

## How It Works Now

1. **On App Load:**
   - SessionRecovery checks for expired auth tokens
   - Clears any stale data automatically
   - Fresh Supabase client initializes

2. **On Data Fetch:**
   - Tries direct REST API first (fast, no auth issues)
   - Falls back to Supabase client if needed
   - Retries once on error
   - Shows clear error message if fails

3. **Keep-Alive Ping:**
   - External service pings `/api/health` every 5 minutes
   - Keeps Supabase project active
   - Prevents auto-pause

## Testing

1. Visit your site
2. Check browser console for any errors
3. Properties should load within 2-3 seconds
4. If you see errors, check:
   - Is Supabase project paused? (Go to dashboard)
   - Are environment variables set correctly?
   - Is keep-alive ping configured?

## When to Upgrade

Stay on free tier if:
- Less than 1,000 visitors/month
- Less than 50 properties
- Can handle occasional 1-2 minute wake-up time

Upgrade to Pro ($25/month) if:
- More than 1,000 visitors/month
- Need guaranteed uptime
- Need faster performance
- Storage approaching 1 GB

## Monitoring

Check your Supabase dashboard regularly:
- Database size (500 MB limit)
- Storage usage (1 GB limit)
- Bandwidth (5 GB/month limit)

## Support

If issues persist after setting up keep-alive:
1. Check Supabase dashboard for project status
2. Verify environment variables in .env.local
3. Check browser console for specific errors
4. Consider upgrading to Pro tier
