# Google Analytics Quick Fix Guide

## What Was Fixed

### 1. Event Timing Issues ✅
- **Problem**: Events were firing before gtag loaded
- **Solution**: Added `waitForGtag()` function that waits up to 1 second for gtag to be available
- **Result**: Events now queue and send once gtag is ready

### 2. Debug Visibility ✅
- **Problem**: No way to see if events were being sent
- **Solution**: Added console logging for all events
- **Result**: Every event now logs to console with `[Analytics]` prefix

### 3. Testing Tools ✅
- **Problem**: Hard to verify if analytics is working
- **Solution**: Created `/test-analytics` page
- **Result**: Easy visual testing with status indicators and event log

### 4. Configuration ✅
- **Problem**: No debug mode enabled
- **Solution**: Enabled `debug_mode` in development
- **Result**: More detailed GA logs in console

## How to Test Right Now

### Step 1: Visit Test Page
```
http://localhost:3000/test-analytics
```
or
```
https://your-domain.com/test-analytics
```

### Step 2: Check Status
- Should show: "Google Analytics is loaded ✅"
- If not, check browser console for errors

### Step 3: Send Test Events
- Click any test button
- Watch the Event Log section
- Check browser console for `[Analytics]` messages

### Step 4: Verify in Google Analytics
1. Open Google Analytics
2. Go to: **Reports → Real-time**
3. Click test buttons on your site
4. Events should appear within 5-10 seconds

## Common Issues & Quick Fixes

### Issue: "gtag is NOT available"
**Quick Fix:**
1. Disable ad blocker
2. Try incognito mode
3. Check browser console for script errors
4. Verify internet connection

### Issue: Events in console but not in GA
**Quick Fix:**
1. Wait 5-10 seconds (events are batched)
2. Check Real-Time view (not main reports)
3. Verify tracking ID: G-3TXYLMX47G
4. Check if you have GA access

### Issue: Some events missing
**Quick Fix:**
1. Check console for error messages
2. Verify event is being called (check code)
3. Try test page to isolate issue
4. Check network tab for failed requests

## What to Check in Browser Console

### Good Signs ✅
```
[GA] Google Analytics initialized with ID: G-3TXYLMX47G
[Analytics] Event: { action: 'view_property', category: 'Property', ... }
[Analytics] Event: { action: 'open_booking_modal', category: 'Booking', ... }
```

### Bad Signs ❌
```
[Analytics] Event not sent (gtag unavailable): ...
Failed to load resource: google-analytics.com
Uncaught ReferenceError: gtag is not defined
```

## Production Deployment

After deploying to production:

1. **Clear Cache**
   ```bash
   # If using Vercel
   vercel --prod --force
   ```

2. **Test Production**
   - Visit your production URL
   - Go to `/test-analytics`
   - Send test events
   - Verify in GA Real-Time

3. **Monitor for 24 Hours**
   - Check Real-Time regularly
   - Events should appear immediately
   - Historical data appears in 24-48 hours

## Expected Behavior

### Development
- Console shows all events with `[Analytics]` prefix
- Debug mode enabled (more verbose logs)
- Events sent to GA (unless blocked by ad blocker)

### Production
- Console shows events (can be disabled if needed)
- Debug mode disabled
- Events sent to GA normally

## Still Having Issues?

### Immediate Actions:
1. ✅ Check `/test-analytics` page
2. ✅ Check browser console
3. ✅ Disable ad blocker
4. ✅ Try incognito mode
5. ✅ Check network tab

### If Still Not Working:
1. Read `ANALYTICS_TROUBLESHOOTING.md` (detailed guide)
2. Verify GA property settings
3. Check if tracking ID is correct
4. Verify you have GA access
5. Try different browser/device

## Key Files Changed

- `lib/analytics.ts` - Added waitForGtag() and logging
- `app/layout.tsx` - Added debug_mode and initialization log
- `app/test-analytics/page.tsx` - New test page
- `ANALYTICS_TROUBLESHOOTING.md` - Detailed troubleshooting

## Next Steps

1. **Test locally** - Visit `/test-analytics` and verify
2. **Deploy to production** - Push changes and test live
3. **Monitor Real-Time** - Watch GA for incoming events
4. **Check after 24h** - Verify historical data appears

## Success Criteria

✅ Test page shows "gtag is available"
✅ Console shows `[Analytics]` event logs
✅ Network tab shows requests to google-analytics.com
✅ Real-Time view in GA shows events
✅ No errors in browser console

If all above are true, analytics is working correctly! 🎉
