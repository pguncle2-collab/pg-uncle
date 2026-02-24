# Prevent Supabase Free Tier Auto-Pause

## Problem
Supabase free tier projects pause after 1 week of inactivity, causing connection timeouts.

## Solution: Keep-Alive Ping

### Option 1: UptimeRobot (Recommended - Free)

1. Go to https://uptimerobot.com (free account)
2. Click "Add New Monitor"
3. Settings:
   - Monitor Type: HTTP(s)
   - Friendly Name: PGUNCLE Keep-Alive
   - URL: `https://your-domain.com/api/health`
   - Monitoring Interval: 5 minutes
4. Save

This pings your site every 5 minutes, preventing Supabase from pausing.

### Option 2: Cron-Job.org (Free)

1. Go to https://cron-job.org
2. Create free account
3. Create new cron job:
   - Title: PGUNCLE Keep-Alive
   - URL: `https://your-domain.com/api/health`
   - Schedule: Every 5 minutes
4. Save

### Option 3: GitHub Actions (Free)

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Supabase Alive

on:
  schedule:
    # Run every 6 hours
    - cron: '0 */6 * * *'
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping health endpoint
        run: |
          curl -f https://your-domain.com/api/health || exit 0
```

## Verify It's Working

1. Check your health endpoint: `https://your-domain.com/api/health`
2. Should return: `{"status":"ok","timestamp":"..."}`
3. Monitor logs in UptimeRobot/Cron-Job dashboard

## When to Upgrade to Pro

Upgrade to Supabase Pro ($25/month) when:
- Getting 1,000+ visitors/month
- Need guaranteed uptime
- Need faster performance
- Storage approaching 1 GB
- Egress approaching 5 GB/month

## Cost Comparison

| Solution | Cost | Uptime | Performance |
|----------|------|--------|-------------|
| Free + Keep-Alive | $0 | 99%+ | Good |
| Supabase Pro | $25/mo | 99.9% | Excellent |
| Firebase | Pay-as-go | 99.9% | Excellent |

**Recommendation**: Start with Free + Keep-Alive, upgrade when you have revenue.
