# Setup Scripts

## Storage Setup Script

This script creates the `property-images` bucket in Supabase.

### Prerequisites

1. Install tsx (TypeScript executor):
```bash
npm install -D tsx
```

2. Get your Supabase Service Role Key:
   - Go to Supabase Dashboard
   - Project Settings → API
   - Copy the "service_role" key (NOT the anon key)

3. Add to `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Run the Script

```bash
npx tsx scripts/setup-storage.ts
```

### What It Does

1. Checks if `property-images` bucket exists
2. Creates the bucket if it doesn't exist
3. Sets it as public
4. Configures file size limit (5MB)
5. Restricts to image types only

### After Running

You still need to add storage policies manually in Supabase Dashboard. The script will show you the SQL commands to run.

### Alternative: Manual Setup

If you prefer not to use the script, follow the instructions in `SUPABASE_STORAGE_SETUP.md` to create the bucket manually through the Supabase Dashboard.
