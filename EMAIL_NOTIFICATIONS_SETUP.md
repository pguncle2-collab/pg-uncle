# 📧 Email Notifications Setup Guide

## 🎯 What This Does

When users book a PG or schedule a visit, both the user and admin receive email notifications automatically.

---

## ✅ Features

### For Bookings:
- ✉️ User receives booking confirmation email
- ✉️ Admin receives new booking notification
- 📋 Includes all booking details
- 💰 Shows total amount and duration

### For Visit Schedules:
- ✉️ User receives visit confirmation email
- ✉️ Admin receives new visit request
- 📅 Includes date, time, and property details

---

## 🚀 Setup (10 minutes)

### Step 1: Get Gmail App Password

1. **Go to Google Account:**
   ```
   https://myaccount.google.com/apppasswords
   ```

2. **Sign in** with your Gmail account

3. **Create App Password:**
   - App name: "PGUNCLE Website"
   - Click "Create"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

4. **Save it securely** - you'll need it in the next step

---

### Step 2: Update .env.local

Add these lines to your `.env.local` file:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=noreply@pguncle.com
ADMIN_EMAIL=info@pguncle.com
```

**Replace:**
- `your-email@gmail.com` - Your Gmail address
- `abcd efgh ijkl mnop` - The app password from Step 1
- `info@pguncle.com` - Email where you want to receive notifications

---

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### Step 4: Test Email Notifications

#### Test Booking Email:
1. Go to your website
2. Sign in with Google
3. Select a property
4. Fill booking form
5. Submit booking
6. Check both emails:
   - User email (booking confirmation)
   - Admin email (new booking notification)

#### Test Visit Email:
1. Go to any property page
2. Click "Schedule a Visit"
3. Fill the form
4. Submit
5. Check both emails

---

## 📧 Email Templates

### Booking Confirmation (User)

```
Subject: 🎉 Booking Confirmed - PGUNCLE

Dear [User Name],

Your booking has been confirmed. Here are the details:

Booking Details:
- Property: [Property Name]
- Location: [Address, City]
- Room Type: [Single/Double/Triple] Sharing
- Move-in Date: [Date]
- Duration: [X] month(s)
- Total Amount: ₹[Amount]
- Special Requests: [If any]

We will contact you shortly to finalize the details.

Best regards,
Team PGUNCLE
```

### New Booking (Admin)

```
Subject: 🔔 New Booking Received - PGUNCLE

New Booking Received!

Customer Details:
- Name: [User Name]
- Email: [User Email]

Booking Details:
- Property: [Property Name]
- Location: [Address, City]
- Room Type: [Single/Double/Triple] Sharing
- Move-in Date: [Date]
- Duration: [X] month(s)
- Total Amount: ₹[Amount]
- Special Requests: [If any]
- Booking ID: [ID]
- Status: Pending

Action Required: Contact the customer to confirm booking details.
```

---

## 🔧 Configuration Options

### Use Different Email Provider

#### For Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### For Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

#### For Custom Domain (e.g., Zoho):
```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
```

---

## 🐛 Troubleshooting

### Issue: Emails not sending

**Check 1: SMTP Configuration**
```bash
# Verify environment variables
echo $SMTP_HOST
echo $SMTP_USER
```

**Check 2: App Password**
- Make sure you're using App Password, not regular password
- App password should be 16 characters
- No spaces in the password

**Check 3: Gmail Settings**
- 2-Factor Authentication must be enabled
- Less secure app access should be OFF (use app password instead)

**Check 4: Server Logs**
Look for these messages in terminal:
- ✅ "Booking confirmation emails sent successfully"
- ⚠️ "SMTP not configured"
- ❌ "Error sending booking emails"

---

### Issue: Emails going to spam

**Solutions:**
1. **Add to contacts** - Add noreply@pguncle.com to contacts
2. **Mark as not spam** - Move email from spam to inbox
3. **Use verified domain** - Set up SPF/DKIM records
4. **Use real email** - Change SMTP_FROM to your actual email

---

### Issue: "Invalid login" error

**Solutions:**
1. Enable 2-Factor Authentication on Gmail
2. Generate new App Password
3. Copy password without spaces
4. Update .env.local
5. Restart server

---

## 📊 Email Delivery Status

### Check if emails are being sent:

1. **Look at server logs** (terminal):
   ```
   ✅ Booking confirmation emails sent successfully
   ```

2. **Check spam folder** if not in inbox

3. **Verify email address** is correct

4. **Test with different email** to rule out provider issues

---

## 🎨 Customize Email Templates

### Edit Booking Email:

File: `app/api/bookings/route.ts`

Look for:
```typescript
await transporter.sendMail({
  subject: '🎉 Booking Confirmed - PGUNCLE',
  html: `...` // Edit this HTML
});
```

### Edit Visit Email:

File: `app/api/book-visit/route.ts`

Look for:
```typescript
await transporter.sendMail({
  subject: '📅 Visit Scheduled - PGUNCLE',
  html: `...` // Edit this HTML
});
```

---

## 🔒 Security Best Practices

1. **Never commit .env.local** to Git
   - Already in .gitignore ✅

2. **Use App Passwords** instead of real passwords
   - More secure ✅
   - Can be revoked easily ✅

3. **Rotate passwords regularly**
   - Every 90 days recommended

4. **Monitor email usage**
   - Check Gmail sent folder
   - Watch for suspicious activity

---

## 📈 Email Limits

### Gmail Free:
- 500 emails per day
- 100 recipients per email
- Good for small to medium sites

### Gmail Workspace:
- 2,000 emails per day
- Better for production

### Alternatives for High Volume:
- SendGrid (100 emails/day free)
- Mailgun (5,000 emails/month free)
- AWS SES (62,000 emails/month free)

---

## ✅ Testing Checklist

- [ ] Gmail App Password created
- [ ] .env.local updated with SMTP details
- [ ] Dev server restarted
- [ ] Test booking email sent
- [ ] User receives booking confirmation
- [ ] Admin receives booking notification
- [ ] Test visit email sent
- [ ] User receives visit confirmation
- [ ] Admin receives visit request
- [ ] Emails not in spam folder

---

## 🎯 What Gets Sent

### Booking Flow:
```
User books PG
    ↓
Booking saved to database
    ↓
Email sent to user (confirmation)
    ↓
Email sent to admin (notification)
    ↓
Both receive emails ✅
```

### Visit Flow:
```
User schedules visit
    ↓
Visit saved to database
    ↓
Email sent to user (confirmation)
    ↓
Email sent to admin (notification)
    ↓
Both receive emails ✅
```

---

## 📞 Support

### Gmail Issues:
- Help: https://support.google.com/mail
- App Passwords: https://myaccount.google.com/apppasswords

### Nodemailer Issues:
- Docs: https://nodemailer.com/
- GitHub: https://github.com/nodemailer/nodemailer

---

## 🎉 Success!

Once configured, you'll automatically receive:
- ✅ Booking confirmations
- ✅ Visit requests
- ✅ Customer details
- ✅ All booking information

**Time to Setup:** 10 minutes  
**Difficulty:** Easy  
**Status:** 🟢 Ready to Configure

Start with Step 1 above to get your Gmail App Password!
