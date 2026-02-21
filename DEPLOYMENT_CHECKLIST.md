# Deployment Checklist for Vercel

## ✅ Environment Variables to Add in Vercel

Copy these exact values to Vercel Dashboard → Settings → Environment Variables:

### 1. Supabase Configuration (REQUIRED)
```
NEXT_PUBLIC_SUPABASE_URL=https://ijwbczqupzocgvuylanr.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2JjenF1cHpvY2d2dXlsYW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjY5NDIsImV4cCI6MjA4NTU0Mjk0Mn0.33oPoABV9w9dSagvv4TZcN6RMgOBVq6ax5rMXSpSLEY
```

### 2. Admin Configuration (OPTIONAL)
```
ADMIN_PASSWORD=admin123
```

### 3. Razorpay Configuration (OPTIONAL - for payments)
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. SMTP Email Configuration (OPTIONAL - for contact form)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@pguncle.com
```

## 📋 Step-by-Step Deployment Process

### Step 1: Add Environment Variables in Vercel
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Settings" tab
4. Click "Environment Variables" in sidebar
5. For each variable above:
   - Click "Add New"
   - Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Paste the value
   - Select all environments: Production, Preview, Development
   - Click "Save"

### Step 2: Verify Variables Added
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] ADMIN_PASSWORD (optional)
- [ ] NEXT_PUBLIC_RAZORPAY_KEY_ID (optional)
- [ ] RAZORPAY_KEY_SECRET (optional)
- [ ] SMTP_HOST (optional)
- [ ] SMTP_PORT (optional)
- [ ] SMTP_USER (optional)
- [ ] SMTP_PASS (optional)
- [ ] SMTP_FROM (optional)

### Step 3: Redeploy
1. Go to "Deployments" tab
2. Find the latest deployment
3. Click the three dots (...)
4. Click "Redeploy"
5. Click "Redeploy" again to confirm

### Step 4: Wait for Deployment
- Wait 2-3 minutes for build to complete
- Check build logs for any errors

### Step 5: Test the Website
Visit your deployed URL and test:
- [ ] Homepage loads correctly
- [ ] Properties page shows data
- [ ] Discount popup appears after 3 seconds
- [ ] Navbar displays properly with logo
- [ ] Footer displays correctly
- [ ] Login/Signup works
- [ ] Booking modal opens
- [ ] No console errors

## 🔍 Troubleshooting

### If you still see "supabaseUrl is required" error:

1. **Check variable names are exact** (case-sensitive):
   - Must be `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
   - Must be `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `SUPABASE_KEY`)

2. **Check for extra spaces**:
   - No spaces before or after the value
   - Copy-paste directly from this file

3. **Verify environment selection**:
   - All three should be checked: Production, Preview, Development

4. **Clear build cache**:
   - When redeploying, uncheck "Use existing Build Cache"

5. **Check Vercel logs**:
   - Go to Deployments → Click on deployment → View Function Logs
   - Look for any error messages

### Common Issues:

**Issue**: Variables not loading
**Solution**: Make sure variable names start with `NEXT_PUBLIC_` for client-side access

**Issue**: Old deployment still showing
**Solution**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Issue**: Build fails
**Solution**: Check build logs for specific error messages

## 🎯 Priority Variables

For the website to work, you MUST add these two:
1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

All other variables are optional and can be added later when you need those features.

## 📞 Next Steps After Deployment

1. Test all major features
2. Check mobile responsiveness
3. Verify booking flow works
4. Test authentication
5. Monitor error logs in Vercel dashboard

## 🔐 Security Notes

- Never commit `.env.local` to git (already in .gitignore)
- The anon key is safe to expose (it's public)
- Keep `RAZORPAY_KEY_SECRET` and `SMTP_PASS` secret
- Don't share these values publicly

## ✨ Features That Will Work After Setup

- ✅ Property listings from Supabase
- ✅ User authentication (signup/login)
- ✅ Booking system
- ✅ Discount popup
- ✅ Room image modals
- ✅ Book visit functionality
- ✅ User profile management
- ✅ Admin dashboard (with ADMIN_PASSWORD)
- ⚠️ Payment processing (needs Razorpay keys)
- ⚠️ Contact form emails (needs SMTP config)
