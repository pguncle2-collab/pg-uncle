# 🔧 Fix Supabase AbortError - Quick Solutions

## ❌ The Error

```
Database Connection Error
AbortError: signal is aborted without reason
Please try again later or contact support
```

## 🎯 What This Means

This error happens when:
1. Supabase request times out
2. Network connection is slow/interrupted
3. Supabase project is paused (free tier)
4. Too many concurrent requests

## ✅ Quick Fixes (Try in Order)

### Fix 1: Check Supabase Project Status (Most Common)

1. Go to: https://supabase.com/dashboard
2. Click your project
3. Check if you see: **"Project Paused"** banner
4. If paused, click **"Restore Project"**
5. Wait 1-2 minutes for it to wake up
6. Try again

**Why?** Free tier projects pause after inactivity.

---

### Fix 2: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

**Why?** Clears stale connections.

---

### Fix 3: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"
4. Or use: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

**Why?** Clears cached failed requests.

---

### Fix 4: Check Internet Connection

1. Open: https://supabase.com in browser
2. If it loads, connection is fine
3. If not, check your internet

**Why?** Network issues cause timeouts.

---

### Fix 5: Check Supabase Status

1. Go to: https://status.supabase.com/
2. Check if there are any incidents
3. If yes, wait for resolution

**Why?** Supabase might be having issues.

---

## 🔍 Verify Supabase Connection

Run this in browser console (F12):

```javascript
// Test Supabase connection
fetch('https://ijwbczqupzocgvuylanr.supabase.co/rest/v1/')
  .then(r => r.json())
  .then(d => console.log('✅ Supabase connected:', d))
  .catch(e => console.error('❌ Supabase error:', e));
```

Should see: `✅ Supabase connected`

---

## 🚀 Permanent Solutions

### Solution 1: Upgrade Supabase Plan

Free tier projects pause after 1 week of inactivity.

**Options:**
- **Pro Plan** ($25/month) - Never pauses
- **Keep Free** - Just restore when paused

### Solution 2: Keep Project Active

Add this to your cron job or use a service like UptimeRobot:

```bash
# Ping your site every 5 minutes
curl https://your-site.com
```

**Why?** Keeps Supabase project active.

---

## 🐛 Advanced Troubleshooting

### Check Environment Variables

```bash
# In terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Should show your Supabase URL and key.

### Check .env.local File

```bash
cat .env.local
```

Should contain:
```
NEXT_PUBLIC_SUPABASE_URL=https://ijwbczqupzocgvuylanr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

### Test Supabase Directly

```bash
curl https://ijwbczqupzocgvuylanr.supabase.co/rest/v1/ \
  -H "apikey: your-anon-key"
```

Should return JSON response.

---

## 📊 Common Scenarios

### Scenario 1: Project Just Paused
**Symptom**: Error after not using site for a while  
**Fix**: Restore project in dashboard  
**Time**: 1-2 minutes

### Scenario 2: Network Timeout
**Symptom**: Error on slow connection  
**Fix**: Refresh page, check internet  
**Time**: Immediate

### Scenario 3: Too Many Requests
**Symptom**: Error after many rapid actions  
**Fix**: Wait 30 seconds, try again  
**Time**: 30 seconds

### Scenario 4: Supabase Outage
**Symptom**: Error for everyone  
**Fix**: Wait for Supabase to fix  
**Time**: Varies (check status page)

---

## ✅ Prevention Tips

1. **Upgrade to Pro** - Never pauses ($25/month)
2. **Use UptimeRobot** - Pings site every 5 minutes (free)
3. **Add Health Check** - Keep project active
4. **Monitor Status** - Subscribe to Supabase status updates

---

## 🎯 Quick Checklist

- [ ] Check if Supabase project is paused
- [ ] Restore project if paused
- [ ] Wait 1-2 minutes for project to wake up
- [ ] Restart dev server
- [ ] Clear browser cache
- [ ] Try booking again

---

## 💡 Understanding Free Tier

**Supabase Free Tier:**
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth
- ⚠️ Pauses after 1 week inactivity
- ⚠️ Takes 1-2 minutes to restore

**When to Upgrade:**
- Production app
- Need 99.9% uptime
- Can't afford pauses
- Need more resources

---

## 🔄 If Still Not Working

1. **Check Supabase Dashboard**
   - Project status
   - Database health
   - API logs

2. **Check Browser Console**
   - Look for other errors
   - Check network tab
   - See failed requests

3. **Check Server Logs**
   - Terminal output
   - API route errors
   - Connection issues

4. **Contact Support**
   - Supabase: support@supabase.com
   - Include: Project ID, error message, timestamp

---

**Most Common Fix**: Restore paused project in Supabase Dashboard  
**Time to Fix**: 1-2 minutes  
**Success Rate**: 95%

Check your Supabase Dashboard now!
