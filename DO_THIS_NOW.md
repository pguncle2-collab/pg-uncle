# ⚡ DO THIS NOW - Exact Steps

## 🎯 Your Mission: Fix Google Login in 3 Minutes

---

## STEP 1: Open Supabase (30 seconds)

1. Open this link in a new tab: https://supabase.com/dashboard
2. You'll see your projects
3. Click on the project that has this ID: `ijwbczqupzocgvuylanr`

---

## STEP 2: Set Site URL (1 minute)

1. Look at the left sidebar (black background)
2. Scroll to the bottom
3. Click the **gear icon** (⚙️) that says "Settings"
4. Click **"General"** (should be first option)
5. Scroll down until you see **"Site URL"**
6. Click in the text box
7. Type exactly: `http://localhost:3000`
8. Click the **"Save"** button

**✅ DONE! This is the main fix.**

---

## STEP 3: Add Redirect URLs (1 minute)

1. Still in Settings, look at the left sidebar
2. Click **"Authentication"** (under Settings)
3. Scroll down to **"Redirect URLs"** section
4. Click in the text area
5. Type these URLs (press Enter after each):
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000
   ```
6. Click **"Save"**

**✅ DONE! Security is set.**

---

## STEP 4: Verify Google is Enabled (30 seconds)

1. In the left sidebar, click **"Authentication"** (the main one, not under Settings)
2. Click **"Providers"**
3. Scroll down to find **"Google"**
4. Check if the toggle is **green/ON**
5. If it's OFF or missing Client ID/Secret, tell me - we'll fix that next

**✅ DONE! Google is ready.**

---

## STEP 5: Test It (30 seconds)

1. **Close your browser completely** (all windows)
2. Open terminal and restart dev server:
   ```bash
   npm run dev
   ```
3. Open browser: http://localhost:3000
4. Click **Login**
5. Click **"Continue with Google"**
6. Sign in with your Google account
7. **You should be redirected back to homepage and logged in!**

**✅ DONE! You're logged in.**

---

## 🎉 That's It!

If it worked, you're done! Google login is fixed.

If it didn't work, tell me:
1. Which step failed?
2. What error did you see?
3. Take a screenshot and share it

---

## 🚨 If Google Provider is Not Set Up

If in Step 4 you saw that Google is OFF or missing credentials:

### Quick Setup (5 minutes):

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Go to: **APIs & Services** → **Credentials**
4. Click: **Create Credentials** → **OAuth client ID**
5. If asked, configure consent screen:
   - User Type: **External**
   - App name: **PGUNCLE**
   - Your email
   - Click through all steps
6. Create OAuth Client:
   - Type: **Web application**
   - Name: **PGUNCLE**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `https://ijwbczqupzocgvuylanr.supabase.co/auth/v1/callback`
   - Click **Create**
7. Copy the **Client ID** and **Client Secret**
8. Go back to Supabase → Authentication → Providers → Google
9. Paste Client ID and Client Secret
10. Toggle Google **ON**
11. Click **Save**

Then go back to Step 5 and test again.

---

## 📋 Quick Checklist

- [ ] Opened Supabase dashboard
- [ ] Set Site URL to `http://localhost:3000`
- [ ] Added redirect URLs
- [ ] Verified Google is enabled
- [ ] Closed browser completely
- [ ] Restarted dev server
- [ ] Tested Google login

---

## 💬 Need Help?

Just tell me:
- "Step X didn't work"
- "I don't see [something]"
- "I got error: [error message]"

I'll help you fix it immediately!

---

**Time needed**: 3 minutes  
**Difficulty**: Easy  
**Result**: Google login working perfectly ✅
