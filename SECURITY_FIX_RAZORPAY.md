# 🚨 CRITICAL: Razorpay Keys Exposed - Security Fix

## ⚠️ WHAT HAPPENED

Your Razorpay **LIVE** keys were exposed in the Git commit history. GitGuardian detected them and they are now considered compromised.

**Exposed Keys:**
- Key ID: `rzp_live_SJGax4O5mAZXSv`
- Key Secret: `neU4EkfNx5u2zxJBq6yJnIy8`

**Risk Level:** 🔴 **CRITICAL**

---

## 🚨 IMMEDIATE ACTIONS (DO NOW!)

### Step 1: Revoke Compromised Keys (5 minutes)

1. **Go to Razorpay Dashboard:**
   ```
   https://dashboard.razorpay.com/app/keys
   ```

2. **Switch to Live Mode** (toggle at top right)

3. **Regenerate Key Secret:**
   - Click on your current Key ID
   - Click **"Regenerate Key Secret"**
   - Confirm regeneration
   - **COPY THE NEW SECRET IMMEDIATELY** (you can't see it again!)

4. **Save New Keys Securely:**
   - New Key ID: `rzp_live_XXXXXXXXXX`
   - New Key Secret: `XXXXXXXXXXXXXXXX`

---

### Step 2: Update .env.local (2 minutes)

1. Open your `.env.local` file
2. Replace the old keys with new ones:

```env
# OLD (COMPROMISED - DO NOT USE)
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SJGax4O5mAZXSv
# RAZORPAY_KEY_SECRET=neU4EkfNx5u2zxJBq6yJnIy8

# NEW (from Razorpay Dashboard)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_NEW_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_NEW_KEY_SECRET
```

3. **Save the file**

---

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### Step 4: Verify New Keys Work

1. Go to your website
2. Try to create a booking
3. Payment popup should open with new keys
4. **DO NOT complete payment** (use test mode for testing)

---

## 🔒 PREVENT FUTURE EXPOSURE

### Rule 1: NEVER Commit Secrets

**Files to NEVER commit:**
- `.env.local` ✅ (already in .gitignore)
- `.env`
- Any file with API keys, passwords, secrets

**Check .gitignore:**
```bash
cat .gitignore | grep env
```

Should show:
```
.env*.local
.env
```

---

### Rule 2: Use Environment Variables

**✅ CORRECT:**
```typescript
const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
```

**❌ WRONG:**
```typescript
const keyId = 'rzp_live_SJGax4O5mAZXSv'; // NEVER DO THIS!
```

---

### Rule 3: Use .env.example for Templates

**In .env.local.example:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**NOT:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SJGax4O5mAZXSv  # WRONG!
```

---

### Rule 4: Scan Before Committing

Install git-secrets:
```bash
# Mac
brew install git-secrets

# Configure
git secrets --install
git secrets --register-aws
```

---

## 🔍 CHECK FOR OTHER EXPOSED SECRETS

### Check Git History

```bash
# Search for potential secrets
git log --all -p | grep -i "key\|secret\|password\|token" | head -20
```

### Check Current Files

```bash
# Search in all files
grep -r "rzp_live\|rzp_test" . --exclude-dir=node_modules --exclude-dir=.git
```

---

## 📊 WHAT TO MONITOR

### 1. Razorpay Dashboard

Check for suspicious activity:
- Go to: https://dashboard.razorpay.com/app/payments
- Look for unauthorized transactions
- Check payment attempts
- Review API logs

### 2. Enable Webhooks

Get notified of all payments:
```
https://dashboard.razorpay.com/app/webhooks
```

### 3. Set Up Alerts

Enable email alerts for:
- All successful payments
- Failed payments
- Refunds
- Disputes

---

## 🚨 IF UNAUTHORIZED CHARGES OCCUR

1. **Immediately contact Razorpay:**
   - Email: support@razorpay.com
   - Phone: +91-80-6890-6890
   - Report: Compromised API keys

2. **Disable API Keys:**
   - Go to Dashboard → API Keys
   - Disable all keys
   - Generate new ones

3. **Review Transactions:**
   - Check all recent payments
   - Identify unauthorized ones
   - Request refunds if needed

4. **File Report:**
   - Document everything
   - Save screenshots
   - Keep email trail

---

## ✅ SECURITY CHECKLIST

After fixing:

- [ ] Old Razorpay keys revoked
- [ ] New keys generated
- [ ] .env.local updated with new keys
- [ ] Dev server restarted
- [ ] Payment flow tested
- [ ] No secrets in git history
- [ ] .gitignore includes .env files
- [ ] Monitoring enabled on Razorpay
- [ ] Team notified (if applicable)
- [ ] Documentation updated

---

## 🎓 LEARN MORE

### Best Practices

1. **Use Secret Management:**
   - Vercel: Environment Variables
   - AWS: Secrets Manager
   - HashiCorp: Vault

2. **Rotate Keys Regularly:**
   - Every 90 days
   - After team member leaves
   - After any suspected breach

3. **Use Test Keys in Development:**
   - `rzp_test_` for development
   - `rzp_live_` only in production

4. **Implement IP Whitelisting:**
   - Restrict API access to known IPs
   - Configure in Razorpay Dashboard

---

## 📞 SUPPORT

### Razorpay Support
- Email: support@razorpay.com
- Phone: +91-80-6890-6890
- Docs: https://razorpay.com/docs/

### GitGuardian
- Dashboard: https://dashboard.gitguardian.com/
- Docs: https://docs.gitguardian.com/

---

## 🎯 SUMMARY

**What Happened:**
- Razorpay live keys exposed in Git
- GitGuardian detected and alerted
- Keys are now compromised

**What to Do:**
1. ✅ Revoke old keys in Razorpay Dashboard
2. ✅ Generate new keys
3. ✅ Update .env.local
4. ✅ Restart server
5. ✅ Monitor for suspicious activity

**Time Required:** 10 minutes  
**Priority:** 🔴 CRITICAL  
**Status:** ⚠️ ACTION REQUIRED NOW

---

**DO NOT DELAY!** Revoke the keys immediately to prevent unauthorized charges.
