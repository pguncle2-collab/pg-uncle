# Google Analytics Troubleshooting Guide

## Current Setup
- **Tracking ID**: G-3TXYLMX47G
- **Implementation**: gtag.js (Google Analytics 4)
- **Location**: `app/layout.tsx` and `lib/analytics.ts`

## Quick Diagnosis

### 1. Test Analytics Page
Visit: `http://localhost:3000/test-analytics` (or your production URL)

This page will:
- ✅ Check if gtag is loaded
- 🔵 Let you send test events
- 📊 Show event logs in real-time
- 📋 Provide troubleshooting steps

### 2. Check Browser Console
Open DevTools (F12) → Console tab

Look for:
```
[GA] Google Analytics initialized with ID: G-3TXYLMX47G
[Analytics] Event: { action: '...', category: '...', ... }
```

### 3. Check Network Tab
Open DevTools (F12) → Network tab

Filter by: `google-analytics.com` or `gtag`

You should see:
- `gtag/js?id=G-3TXYLMX47G` (script load)
- `collect?v=2&...` (event requests)

## Common Issues & Solutions

### Issue 1: No Events in Google Analytics

**Symptoms:**
- Events fire in console but don't appear in GA
- Real-Time view shows 0 users

**Solutions:**

1. **Verify Tracking ID**
   - Go to Google Analytics Admin
   - Check Data Streams → Web → Measurement ID
   - Should be: `G-3TXYLMX47G`

2. **Check Data Stream Status**
   - Ensure the data stream is not paused
   - Verify the website URL matches your domain

3. **Wait for Real-Time**
   - Events appear in Real-Time within seconds
   - Historical reports take 24-48 hours

4. **Check Filters**
   - Ensure no filters are blocking your traffic
   - Check if internal traffic filter is excluding you

### Issue 2: gtag Not Loading

**Symptoms:**
- Console shows: "gtag is NOT available"
- No network requests to google-analytics.com

**Solutions:**

1. **Ad Blocker**
   - Disable ad blockers (uBlock, AdBlock, etc.)
   - Try incognito/private mode
   - Test on different browser

2. **Content Security Policy**
   - Check browser console for CSP errors
   - Verify `next.config.js` allows Google Analytics

3. **Network Issues**
   - Check if google-analytics.com is accessible
   - Try different network (mobile hotspot)
   - Check firewall/proxy settings

4. **Script Loading**
   - Verify script tag in page source (View Page Source)
   - Check for JavaScript errors before gtag loads

### Issue 3: Events Fire But Not Tracked

**Symptoms:**
- Console shows events being sent
- Network shows requests
- But GA shows nothing

**Solutions:**

1. **Debug Mode**
   - Already enabled in development
   - Check console for detailed GA logs

2. **Event Parameters**
   - Verify event names are valid (no spaces, special chars)
   - Check parameter names match GA4 conventions

3. **Sampling**
   - GA4 may sample data in free tier
   - Check if you're hitting limits

4. **Property Configuration**
   - Verify property is GA4 (not Universal Analytics)
   - Check data retention settings

### Issue 4: Delayed Event Tracking

**Symptoms:**
- Events appear after delay
- Some events missing

**Solutions:**

1. **Already Fixed**: Added `waitForGtag()` function
   - Waits for gtag to be available before sending events
   - Retries up to 10 times with 100ms delay

2. **Async Loading**
   - Script loads asynchronously (normal behavior)
   - Events queue until gtag is ready

## Verification Steps

### Step 1: Local Testing
```bash
# Start dev server
npm run dev

# Visit test page
open http://localhost:3000/test-analytics

# Click test buttons and watch console
```

### Step 2: Check Real-Time in GA
1. Go to Google Analytics
2. Navigate to: Reports → Real-time
3. Click test buttons on your site
4. Should see events appear within 5-10 seconds

### Step 3: Check DebugView (Recommended)
1. Go to: Admin → DebugView
2. Events will show with full details
3. Better for debugging than Real-Time

### Step 4: Production Testing
```bash
# Build and start production
npm run build
npm start

# Test on production URL
# Events should work the same
```

## Event Tracking Reference

### Currently Tracked Events

**Property Events:**
- `view_property` - When property card is viewed
- `view_property_details` - When property detail page opens
- `filter_properties` - When filters are applied

**Booking Events:**
- `open_booking_modal` - When booking modal opens
- `initiate_booking` - When user starts booking
- `complete_booking` - When booking is confirmed
- `cancel_booking` - When booking is cancelled

**Payment Events:**
- `initiate_payment` - When payment starts
- `payment_success` - When payment succeeds
- `payment_failed` - When payment fails

**Visit Events:**
- `open_visit_modal` - When visit scheduling modal opens
- `schedule_visit` - When visit is scheduled

**Auth Events:**
- `open_auth_modal` - When login/signup modal opens
- `login` - When user logs in
- `signup` - When user signs up
- `logout` - When user logs out

**Navigation Events:**
- `click_nav_link` - When navigation link is clicked
- `click_cta` - When CTA button is clicked

**Other Events:**
- `submit_contact_form` - When contact form is submitted
- `click_whatsapp` - When WhatsApp button is clicked
- `search` - When search is performed
- `error` - When errors occur

## Advanced Debugging

### Enable GA Debug Mode
Already enabled in development. To enable in production:

```javascript
gtag('config', 'G-3TXYLMX47G', {
  debug_mode: true
});
```

### Check dataLayer
In browser console:
```javascript
// Check if dataLayer exists
console.log(window.dataLayer);

// Check recent events
console.log(window.dataLayer.slice(-10));

// Manually send test event
gtag('event', 'test_event', {
  event_category: 'test',
  event_label: 'manual_test'
});
```

### Monitor Network Requests
```javascript
// In console, log all GA requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  if (args[0].includes('google-analytics')) {
    console.log('GA Request:', args);
  }
  return originalFetch.apply(this, args);
};
```

## Still Not Working?

### Checklist:
- [ ] Tracking ID is correct (G-3TXYLMX47G)
- [ ] Ad blocker is disabled
- [ ] Browser console shows no errors
- [ ] Network tab shows gtag script loading
- [ ] Test page shows "gtag is available"
- [ ] Real-Time view is open in GA
- [ ] Tested in incognito mode
- [ ] Tested on different browser
- [ ] Waited 5-10 seconds after clicking

### Next Steps:
1. Check Google Analytics property settings
2. Verify you have access to the GA property
3. Check if property is in "Testing" mode
4. Contact Google Analytics support
5. Try creating a new GA4 property

## Contact & Support

If issues persist:
1. Share screenshots from test page
2. Share browser console logs
3. Share network tab (filtered for google-analytics)
4. Verify GA property access and settings
