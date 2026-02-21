# Vercel Environment Variables Setup

## Error Fix: "supabaseUrl is required"

This error occurs because the Supabase environment variables are not configured in Vercel.

## Steps to Fix:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project (pguncle)

### 2. Navigate to Environment Variables
- Click on "Settings" tab
- Click on "Environment Variables" in the left sidebar

### 3. Add Required Environment Variables

Add the following variables (one by one):

#### Required Variables:

**NEXT_PUBLIC_SUPABASE_URL**
- Value: Your Supabase project URL
- Example: `https://xxxxxxxxxxxxx.supabase.co`
- Environment: Production, Preview, Development (select all)

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Value: Your Supabase anonymous key
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Environment: Production, Preview, Development (select all)

#### Optional Variables (if using these features):

**ADMIN_PASSWORD**
- Value: Your admin password
- Example: `admin123`
- Environment: Production, Preview, Development

**SMTP_HOST**
- Value: `smtp.gmail.com`
- Environment: Production, Preview, Development

**SMTP_PORT**
- Value: `587`
- Environment: Production, Preview, Development

**SMTP_USER**
- Value: Your Gmail address
- Example: `your-email@gmail.com`
- Environment: Production, Preview, Development

**SMTP_PASS**
- Value: Your Gmail app password (not regular password)
- Environment: Production, Preview, Development

**SMTP_FROM**
- Value: `noreply@pguncle.com`
- Environment: Production, Preview, Development

### 4. Where to Find Supabase Credentials

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click on "Settings" (gear icon)
4. Click on "API" in the left sidebar
5. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Redeploy

After adding all environment variables:
1. Go to "Deployments" tab
2. Click on the three dots (...) next to the latest deployment
3. Click "Redeploy"
4. Select "Use existing Build Cache" (optional)
5. Click "Redeploy"

## Verification

After redeployment, your website should work without the "supabaseUrl is required" error.

## Quick Checklist

- [ ] Added NEXT_PUBLIC_SUPABASE_URL
- [ ] Added NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed the application
- [ ] Verified the website is working

## Troubleshooting

If you still see errors:
1. Check that variable names are exactly correct (case-sensitive)
2. Ensure there are no extra spaces in the values
3. Verify the Supabase URL ends with `.supabase.co`
4. Make sure you're using the `anon` key, not the `service_role` key
5. Wait 1-2 minutes after redeployment for changes to take effect

## Important Notes

- Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` file to git (it's in .gitignore)
- The `.env.local.example` file is just a template
- Vercel automatically loads environment variables during build and runtime
