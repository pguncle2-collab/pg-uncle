# Email Setup Guide for Contact Form

## Overview
The contact form now sends emails to **info@pguncle.com** when users submit the form.

## Installation Steps

### 1. Install Nodemailer
Run this command in your project directory:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### 2. Configure SMTP Settings

Add these variables to your `.env.local` file:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@pguncle.com
```

## SMTP Provider Options

### Option 1: Gmail (Recommended for Testing)

**Steps:**
1. Use a Gmail account (e.g., pguncle.notifications@gmail.com)
2. Enable 2-Factor Authentication on the Gmail account
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "PGUNCLE Contact Form"
   - Copy the 16-character password
4. Update `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=pguncle.notifications@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM=noreply@pguncle.com
   ```

**Gmail Limits:**
- 500 emails per day (free)
- 2000 emails per day (Google Workspace)

### Option 2: SendGrid (Recommended for Production)

**Steps:**
1. Sign up at https://sendgrid.com (Free tier: 100 emails/day)
2. Create an API Key
3. Update `.env.local`:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=noreply@pguncle.com
   ```

### Option 3: AWS SES (Best for High Volume)

**Steps:**
1. Set up AWS SES account
2. Verify your domain
3. Get SMTP credentials
4. Update `.env.local`:
   ```env
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=your-aws-smtp-username
   SMTP_PASS=your-aws-smtp-password
   SMTP_FROM=noreply@pguncle.com
   ```

### Option 4: Custom Domain Email

If you have email hosting with your domain provider:

```env
SMTP_HOST=mail.pguncle.com
SMTP_PORT=587
SMTP_USER=noreply@pguncle.com
SMTP_PASS=your-email-password
SMTP_FROM=noreply@pguncle.com
```

## Email Features

### What Gets Sent

**To:** info@pguncle.com  
**From:** Your configured SMTP_FROM address  
**Reply-To:** User's email (so you can reply directly)  
**Subject:** Contact Form: [User's Subject]

### Email Content Includes:
- User's name
- User's email (clickable)
- User's phone number
- Subject
- Message
- Timestamp (India timezone)
- Professional HTML formatting
- Plain text fallback

### Email Template Preview

```
┌─────────────────────────────────────┐
│ 🏠 New Contact Form Submission      │
│ PGUNCLE - PG Accommodation          │
├─────────────────────────────────────┤
│ 👤 Name: John Doe                   │
│ 📧 Email: john@example.com          │
│ 📱 Phone: 9876543210                │
│ 📋 Subject: Inquiry about PG        │
│ 💬 Message: I would like to know... │
│ 🕐 Received: 21/02/2024, 10:30 AM   │
├─────────────────────────────────────┤
│ Reply directly to respond to user   │
└─────────────────────────────────────┘
```

## Testing

### 1. Test Locally

After setting up SMTP credentials:

```bash
npm run dev
```

1. Go to http://localhost:3000/contact
2. Fill out the contact form
3. Submit
4. Check info@pguncle.com inbox

### 2. Check Logs

Monitor the terminal for:
- "Email sent successfully to info@pguncle.com" (success)
- "Email sending error:" (failure)

### 3. Common Issues

**Issue:** "Invalid login"
- Solution: Check SMTP_USER and SMTP_PASS are correct
- For Gmail: Make sure you're using App Password, not regular password

**Issue:** "Connection timeout"
- Solution: Check SMTP_HOST and SMTP_PORT
- Try port 465 with secure: true

**Issue:** "Email not received"
- Solution: Check spam folder
- Verify info@pguncle.com is a valid email address
- Check email provider logs

## Security Best Practices

1. **Never commit `.env.local`** to git
2. **Use App Passwords** instead of real passwords
3. **Rotate credentials** regularly
4. **Monitor usage** to detect abuse
5. **Rate limit** the contact form (consider adding captcha)

## Production Deployment

### Vercel
Add environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all SMTP_* variables
3. Redeploy

### Other Platforms
Add environment variables according to your platform's documentation.

## Monitoring

### Email Delivery
- Check SMTP provider dashboard for delivery stats
- Monitor bounce rates
- Set up alerts for failures

### Form Submissions
- All submissions are logged to console
- Consider adding database logging for backup

## Troubleshooting

### Test SMTP Connection

Create a test file `test-email.js`:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password',
  },
});

transporter.sendMail({
  from: 'noreply@pguncle.com',
  to: 'info@pguncle.com',
  subject: 'Test Email',
  text: 'This is a test email',
}).then(() => {
  console.log('Email sent successfully!');
}).catch((error) => {
  console.error('Error:', error);
});
```

Run: `node test-email.js`

## Cost Estimates

| Provider | Free Tier | Paid Plans |
|----------|-----------|------------|
| Gmail | 500/day | N/A |
| SendGrid | 100/day | $15/mo (40k emails) |
| AWS SES | 62k/month | $0.10 per 1000 emails |
| Mailgun | 5k/month | $35/mo (50k emails) |

## Support

If you encounter issues:
1. Check the logs in terminal
2. Verify all environment variables are set
3. Test with a simple email first
4. Check SMTP provider documentation

## Current Configuration

**Recipient:** info@pguncle.com  
**Implementation:** Complete ✓  
**Status:** Ready to use after SMTP setup  
**File:** `app/api/contact/route.ts`
