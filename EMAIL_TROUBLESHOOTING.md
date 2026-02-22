# Email Troubleshooting Guide

## Issue: No Success Message & Email Not Received

### Quick Diagnosis Steps

#### Step 1: Open Browser Console
1. Open the contact page: http://localhost:3000/contact
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Fill out and submit the form
5. Look for these messages:

**What you should see:**
```
Submitting form data: {name: "Test", email: "test@example.com", ...}
Response status: 200
Response data: {success: true, message: "..."}
```

**If you see errors:**
- Check the error message
- Look at Network tab → find `/api/contact` request
- Check the response

#### Step 2: Check Server Terminal
Look at your terminal where `npm run dev` is running.

**If SMTP is NOT configured (expected):**
```
⚠️ SMTP not configured. Email will not be sent. Please configure SMTP in .env.local
Form data saved to console: {...}
```

**If SMTP IS configured:**
```
Contact Form Submission: {...}
Email sent successfully to info@pguncle.com
```

**If there's an error:**
```
Email sending error: [error details]
```

### Common Issues & Solutions

#### Issue 1: Form Submits But No Success Message

**Possible Causes:**
1. JavaScript error preventing state update
2. API returning error status
3. Network issue

**Solution:**
1. Check browser console for errors
2. Check Network tab → `/api/contact` → Response
3. Verify response status is 200
4. Check if `response.ok` is true

#### Issue 2: Success Message Shows But No Email

**This is EXPECTED if SMTP is not configured!**

The form will show success even without SMTP configured. This is intentional so users don't see errors.

**To Fix:**
1. Configure SMTP in `.env.local` (see below)
2. Restart server
3. Test again

#### Issue 3: SMTP Configured But Email Not Sending

**Check These:**
1. ✅ SMTP credentials are correct
2. ✅ Using App Password (not regular password) for Gmail
3. ✅ Server was restarted after changing .env.local
4. ✅ No typos in email addresses
5. ✅ Internet connection is working

### Configure SMTP (Required for Email Sending)

#### Option 1: Gmail (Quick Setup)

1. **Get App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Enable 2FA if not already enabled
   - Create App Password for "Mail"
   - Copy the 16-character password

2. **Update .env.local:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-actual-email@gmail.com
   SMTP_PASS=abcdefghijklmnop
   SMTP_FROM=noreply@pguncle.com
   ```

3. **Restart Server:**
   ```bash
   # Press Ctrl+C
   npm run dev
   ```

#### Option 2: Use Mailtrap (Testing)

For testing without real email:

1. Sign up at https://mailtrap.io (free)
2. Get SMTP credentials from inbox settings
3. Update .env.local:
   ```env
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your-mailtrap-username
   SMTP_PASS=your-mailtrap-password
   SMTP_FROM=noreply@pguncle.com
   ```

### Testing Checklist

- [ ] Open http://localhost:3000/contact
- [ ] Open browser console (F12)
- [ ] Fill out form with test data
- [ ] Click "Send Message"
- [ ] Check browser console for logs
- [ ] Check for success message (green banner)
- [ ] Check server terminal for logs
- [ ] If SMTP configured: Check info@pguncle.com inbox
- [ ] If using Mailtrap: Check Mailtrap inbox

### Expected Behavior

#### Without SMTP Configured:
```
User submits form
    ↓
Browser console: "Submitting form data..."
    ↓
Server logs: "⚠️ SMTP not configured..."
    ↓
Browser console: "Response status: 200"
    ↓
Success message appears (green banner)
    ↓
Form fields cleared
    ↓
NO EMAIL SENT (this is expected)
```

#### With SMTP Configured:
```
User submits form
    ↓
Browser console: "Submitting form data..."
    ↓
Server logs: "Contact Form Submission..."
    ↓
Server logs: "Email sent successfully to info@pguncle.com"
    ↓
Browser console: "Response status: 200"
    ↓
Success message appears (green banner)
    ↓
Form fields cleared
    ↓
Email delivered to info@pguncle.com
```

### Debug Commands

```bash
# Check if nodemailer is installed
npm list nodemailer

# Should show: └── nodemailer@6.x.x

# Check if server is running
# Should see: ▲ Next.js 14.x.x
# Local: http://localhost:3000

# Test API directly with curl
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"1234567890","subject":"Test","message":"Test message"}'
```

### Still Not Working?

1. **Clear browser cache and reload**
2. **Try incognito/private window**
3. **Check if port 3000 is accessible**
4. **Verify .env.local is in root directory**
5. **Check file permissions on .env.local**
6. **Try a different browser**

### Current Status Check

Run this in your terminal:
```bash
# Check nodemailer
npm list nodemailer

# Check if .env.local exists
ls -la .env.local

# Check if server is running
curl http://localhost:3000/api/contact
```

### Contact Form Features Added

✅ Console logging for debugging
✅ Better error handling
✅ Auto-hide success message after 5 seconds
✅ Detailed response logging
✅ Works with or without SMTP

### Next Steps

1. Open browser console (F12)
2. Submit form
3. Check console logs
4. Check server terminal
5. If you see "SMTP not configured" → Configure SMTP
6. If you see errors → Share the error message

---

## Quick Fix Summary

**Problem:** No success message
**Solution:** Check browser console for errors

**Problem:** No email received
**Solution:** Configure SMTP in .env.local and restart server

**Problem:** Success shows but no email
**Solution:** This is normal without SMTP. Configure SMTP to send emails.
