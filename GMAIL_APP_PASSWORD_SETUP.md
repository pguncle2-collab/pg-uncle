# 🔐 Gmail App Password Setup - URGENT

## ⚠️ SECURITY ALERT

**NEVER use your real Gmail password in .env.local!**

Your real password was exposed. Follow these steps immediately:

---

## 🚨 Step 1: Change Your Gmail Password (DO NOW!)

1. Go to: https://myaccount.google.com/security
2. Click **"Password"**
3. Enter current password: `Ram@9813966548`
4. Create a NEW strong password
5. Save it securely (password manager recommended)

---

## 🔑 Step 2: Enable 2-Factor Authentication

1. Go to: https://myaccount.google.com/security
2. Click **"2-Step Verification"**
3. Click **"Get Started"**
4. Follow the setup process
5. Use your phone number for verification

**Why?** Required for App Passwords

---

## 📧 Step 3: Create App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in if prompted
3. Click **"Select app"** → Choose "Mail"
4. Click **"Select device"** → Choose "Other (Custom name)"
5. Type: **"PGUNCLE Website"**
6. Click **"Generate"**
7. **COPY the 16-character password** (e.g., `abcd efgh ijkl mnop`)
8. Click **"Done"**

---

## ⚙️ Step 4: Update .env.local

Open your `.env.local` file and update this line:

```env
SMTP_PASS=your-16-char-app-password-here
```

Replace `your-16-char-app-password-here` with the app password from Step 3.

**Example:**
```env
SMTP_PASS=abcd efgh ijkl mnop
```

**Note:** Remove spaces if you copy-paste!

---

## 🔄 Step 5: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## ✅ Step 6: Test Email

1. Go to your website
2. Book a PG or schedule a visit
3. Check `pguncle2@gmail.com` inbox
4. You should receive the email!

---

## 🔒 Security Best Practices

### ✅ DO:
- Use App Passwords for applications
- Enable 2-Factor Authentication
- Use strong, unique passwords
- Store passwords in password manager
- Rotate passwords every 90 days

### ❌ DON'T:
- Share passwords publicly
- Use same password everywhere
- Use real Gmail password in apps
- Commit passwords to Git
- Share .env.local file

---

## 🐛 Troubleshooting

### Issue: Can't find App Passwords option

**Solution:**
1. Enable 2-Factor Authentication first
2. Wait 5 minutes
3. Try again: https://myaccount.google.com/apppasswords

### Issue: "Invalid credentials" error

**Solution:**
1. Make sure you copied the app password correctly
2. Remove any spaces from the password
3. Generate a new app password
4. Update .env.local
5. Restart server

### Issue: Emails not sending

**Solution:**
1. Check .env.local has correct values
2. Verify app password is 16 characters
3. Check server logs for errors
4. Try generating new app password

---

## 📋 Quick Checklist

- [ ] Changed Gmail password
- [ ] Enabled 2-Factor Authentication
- [ ] Created App Password
- [ ] Updated .env.local with app password
- [ ] Removed spaces from app password
- [ ] Restarted dev server
- [ ] Tested email sending
- [ ] Emails received successfully

---

## 🎯 Current Configuration

Your `.env.local` should look like this:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=pguncle2@gmail.com
SMTP_PASS=abcd efgh ijkl mnop  # Your 16-char app password
SMTP_FROM=pguncle2@gmail.com
ADMIN_EMAIL=pguncle2@gmail.com
```

---

## ⚡ Quick Setup (5 minutes)

1. **Change password**: https://myaccount.google.com/security
2. **Enable 2FA**: https://myaccount.google.com/security
3. **Get app password**: https://myaccount.google.com/apppasswords
4. **Update .env.local**: Add app password
5. **Restart server**: `npm run dev`
6. **Test**: Book a PG and check email

---

## 🆘 Need Help?

If you're stuck:
1. Make sure 2FA is enabled
2. Wait 5 minutes after enabling 2FA
3. Try incognito/private browser window
4. Clear browser cache
5. Try different browser

---

**Priority:** 🔴 CRITICAL  
**Time Required:** 5 minutes  
**Status:** ⚠️ ACTION REQUIRED

**DO THIS NOW** to secure your account and enable email notifications!
