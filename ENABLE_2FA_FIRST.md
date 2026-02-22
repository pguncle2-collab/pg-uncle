# 🔐 Enable 2-Step Verification First!

## ⚠️ The Error You're Seeing:

```
The setting you are looking for is not available for your account
```

This means **2-Step Verification is NOT enabled** on your Google account.

**You MUST enable 2FA before you can create App Passwords.**

---

## ✅ STEP-BY-STEP: Enable 2-Step Verification

### Step 1: Go to Google Security Settings

**Click this link**: https://myaccount.google.com/security

Or manually:
1. Go to https://myaccount.google.com
2. Click **"Security"** in the left sidebar

---

### Step 2: Find 2-Step Verification

Scroll down to **"How you sign in to Google"** section

Look for: **"2-Step Verification"**

You'll see one of these:
- ❌ **"Off"** or **"Get Started"** → You need to enable it
- ✅ **"On"** → Already enabled, skip to Step 5

---

### Step 3: Click "Get Started" or "Turn On"

1. Click the **"2-Step Verification"** option
2. Click **"Get Started"** button
3. Sign in with your password if prompted

---

### Step 4: Choose Verification Method

Google will ask how you want to receive codes. Choose ONE:

#### Option A: Phone Number (Recommended - Easiest)
1. Select **"Text message"** or **"Phone call"**
2. Enter your phone number
3. Click **"Send"** or **"Call"**
4. Enter the 6-digit code you receive
5. Click **"Next"**
6. Click **"Turn On"**

#### Option B: Google Authenticator App
1. Download **Google Authenticator** app on your phone
2. Scan the QR code shown on screen
3. Enter the 6-digit code from the app
4. Click **"Verify"**
5. Click **"Turn On"**

---

### Step 5: Verify 2FA is Enabled

After setup, you should see:
- ✅ **"2-Step Verification: On"**
- Green checkmark or "On" badge

---

### Step 6: Wait 5 Minutes

**IMPORTANT:** After enabling 2FA, wait **5 minutes** before creating App Password.

Google needs time to activate the feature.

---

### Step 7: Create App Password

**Now you can create the App Password!**

1. Go to: https://myaccount.google.com/apppasswords
2. You should now see the App Passwords page (no error!)
3. Follow the steps below...

---

## 📧 Create App Password (After 2FA is Enabled)

### Step 1: Access App Passwords
Go to: https://myaccount.google.com/apppasswords

### Step 2: Select App
- Click **"Select app"** dropdown
- Choose **"Mail"**

### Step 3: Select Device
- Click **"Select device"** dropdown
- Choose **"Other (Custom name)"**
- Type: **"PGUNCLE Website"**

### Step 4: Generate
- Click **"Generate"** button
- You'll see a 16-character password like: `abcd efgh ijkl mnop`

### Step 5: Copy Password
- **COPY the entire password** (including spaces, or remove them)
- Click **"Done"**

**⚠️ IMPORTANT:** You can only see this password ONCE! Copy it now!

---

## ⚙️ Update Your .env.local File

Open `.env.local` and update:

```env
SMTP_PASS=abcdefghijklmnop
```

**Remove all spaces** from the app password!

Example:
- ❌ Wrong: `abcd efgh ijkl mnop`
- ✅ Correct: `abcdefghijklmnop`

---

## 🔄 Restart Your Server

```bash
# Stop server (Ctrl+C in terminal)
npm run dev
```

---

## ✅ Test Email

1. Go to your website
2. Try the contact form or book a PG
3. Check if email is sent successfully

---

## 🐛 Troubleshooting

### Still seeing "not available" error?

**Possible reasons:**

1. **2FA not fully activated yet**
   - Wait 5-10 minutes after enabling 2FA
   - Sign out and sign back in to Google
   - Try again

2. **Using wrong Google account**
   - Make sure you're signed in to `pguncle2@gmail.com`
   - Check top-right corner of Google page
   - Switch accounts if needed

3. **Browser cache issue**
   - Try in Incognito/Private window
   - Clear browser cache
   - Try different browser

4. **Workspace/Organization account**
   - If this is a Google Workspace account, your admin might have disabled App Passwords
   - Contact your workspace admin
   - Or use a personal Gmail account instead

---

## 📋 Quick Checklist

- [ ] Go to https://myaccount.google.com/security
- [ ] Find "2-Step Verification" section
- [ ] Click "Get Started" or "Turn On"
- [ ] Choose phone number or authenticator app
- [ ] Complete verification setup
- [ ] See "2-Step Verification: On" confirmation
- [ ] Wait 5 minutes
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Create app password for "Mail" → "Other"
- [ ] Copy the 16-character password
- [ ] Update .env.local with password (no spaces)
- [ ] Restart dev server
- [ ] Test email sending

---

## 🎯 Visual Guide

### What You Should See:

**Before enabling 2FA:**
```
2-Step Verification
Off
```

**After enabling 2FA:**
```
2-Step Verification
On ✓
```

**App Passwords page (after 2FA):**
```
App passwords
Select the app and device you want to generate the app password for.
[Select app ▼] [Select device ▼]
```

---

## 🆘 Still Stuck?

### Option 1: Use Different Email Service

If you can't enable 2FA or create App Passwords, use a different email service:

**Alternatives:**
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Free tier: 62,000 emails/month)

### Option 2: Use Personal Gmail

If `pguncle2@gmail.com` is a Workspace account with restrictions:
1. Create a new personal Gmail account
2. Enable 2FA on the new account
3. Create App Password
4. Use that in your .env.local

---

## 📞 Need More Help?

**Google Support:**
- Help Center: https://support.google.com/accounts/answer/185833
- 2FA Guide: https://support.google.com/accounts/answer/185839
- App Passwords: https://support.google.com/accounts/answer/185833

---

**TL;DR:**
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Wait 5 minutes
4. Go to https://myaccount.google.com/apppasswords
5. Create app password
6. Copy it to .env.local (no spaces)
7. Restart server
8. Done! 🎉
