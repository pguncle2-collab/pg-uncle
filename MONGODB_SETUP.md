# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email
3. Choose **FREE** tier (M0 Sandbox)
4. Select a cloud provider (AWS recommended)
5. Choose a region close to you
6. Click "Create Cluster" (takes 1-3 minutes)

## Step 2: Create Database User

1. In Atlas dashboard, click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `pguncle_admin` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

## Step 3: Allow Network Access

1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP for production
4. Click "Confirm"

## Step 4: Get Connection String

1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js
5. Version: 5.5 or later
6. Copy the connection string

It looks like:
```
mongodb+srv://pguncle_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 5: Configure Your App

1. Open your `.env.local` file
2. Add these lines:

```env
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb+srv://pguncle_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/pguncle?retryWrites=true&w=majority
```

**Important:** 
- Replace `<password>` with your actual password
- Replace `YOUR_PASSWORD` with your actual password
- Add `/pguncle` before the `?` to specify database name

## Step 6: Import Your Data (Optional)

If you have existing data in Supabase, you can export and import it:

### Export from Supabase:
1. Go to Supabase Dashboard
2. SQL Editor
3. Run: `SELECT * FROM properties;`
4. Export as JSON

### Import to MongoDB:
```bash
# Install MongoDB tools
brew install mongodb-database-tools  # Mac
# or download from https://www.mongodb.com/try/download/database-tools

# Import JSON
mongoimport --uri="your_mongodb_uri" --collection=properties --file=properties.json --jsonArray
```

## Step 7: Test Connection

1. Restart your dev server:
```bash
npm run dev
```

2. Check console logs - should see:
```
🗄️  Using database: MongoDB
🔍 Fetching properties from MongoDB...
✅ MongoDB fetch successful: X properties
```

3. If you see errors:
   - Check your connection string
   - Verify password is correct
   - Ensure IP is whitelisted
   - Check database name is correct

## Step 8: Create Indexes (Recommended)

For better performance, create indexes:

1. Go to Atlas Dashboard
2. Click "Browse Collections"
3. Select `pguncle` database
4. Select `properties` collection
5. Click "Indexes" tab
6. Create these indexes:
   - `city` (ascending)
   - `is_active` (ascending)
   - `created_at` (descending)

Or use MongoDB Compass (GUI tool):
1. Download from https://www.mongodb.com/try/download/compass
2. Connect with your URI
3. Navigate to collection
4. Create indexes

## MongoDB Atlas Free Tier Limits

| Resource | Limit |
|----------|-------|
| Storage | 512 MB |
| RAM | Shared |
| Connections | 500 concurrent |
| Backups | None (manual only) |
| Auto-pause | ❌ NO (always on!) |

## Advantages Over Supabase Free Tier

✅ **No auto-pause** - Always available  
✅ **No bandwidth limits** - Unlimited reads/writes  
✅ **Better for your use case** - No connection issues  
✅ **Reliable** - Industry standard  

## Troubleshooting

### Error: "MongoServerError: bad auth"
- Check your password is correct
- Ensure no special characters need URL encoding
- Try resetting database user password

### Error: "MongooseServerSelectionError"
- Check IP whitelist in Network Access
- Verify connection string format
- Ensure cluster is running

### Error: "Database not found"
- Add `/pguncle` to connection string before `?`
- Example: `...mongodb.net/pguncle?retryWrites=true`

### Properties not showing
- Check if collections exist in Atlas
- Verify data was imported correctly
- Check console logs for errors

## Next Steps

Once MongoDB is working:
1. ✅ Remove Supabase dependencies (optional)
2. ✅ Set up MongoDB backups
3. ✅ Monitor usage in Atlas dashboard
4. ✅ Consider upgrading when you hit 512 MB

## Support

- MongoDB Docs: https://docs.mongodb.com
- Atlas Docs: https://docs.atlas.mongodb.com
- Community: https://community.mongodb.com
