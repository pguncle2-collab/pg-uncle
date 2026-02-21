# 🚀 Quick Fix for Vercel Deployment Error

## The Problem
Error: `supabaseUrl is required` on Vercel

## The Solution (5 minutes)

### Step 1: Go to Vercel
https://vercel.com/dashboard → Select your project → Settings → Environment Variables

### Step 2: Add These Two Variables

**Variable 1:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://ijwbczqupzocgvuylanr.supabase.co`
- Environment: ✅ Production ✅ Preview ✅ Development

**Variable 2:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqd2JjenF1cHpvY2d2dXlsYW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjY5NDIsImV4cCI6MjA4NTU0Mjk0Mn0.33oPoABV9w9dSagvv4TZcN6RMgOBVq6ax5rMXSpSLEY`
- Environment: ✅ Production ✅ Preview ✅ Development

### Step 3: Redeploy
Deployments tab → Latest deployment → ... → Redeploy

### Step 4: Test
After 2-3 minutes, visit your site. It should work!

## Verify It's Working

After deployment, visit:
`https://your-domain.vercel.app/api/verify-env`

You should see:
```json
{
  "status": "success",
  "message": "All required environment variables are set"
}
```

## Need More Help?
- See `DEPLOYMENT_CHECKLIST.md` for detailed instructions
- See `VERCEL_ENV_SETUP.md` for troubleshooting

---

**That's it! Your website should now work on Vercel.** 🎉
