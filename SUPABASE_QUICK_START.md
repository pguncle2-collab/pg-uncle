# 🚀 Supabase Quick Start - pgUncle

## ⚡ 5-Minute Setup

### 1️⃣ Create Supabase Project
- Visit: https://supabase.com
- Click "New Project"
- Name: `pgUncle`
- Wait for initialization

### 2️⃣ Get API Keys
**Settings → API**
- Copy `Project URL`
- Copy `anon public` key

### 3️⃣ Create `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ADMIN_PASSWORD=admin123
```

### 4️⃣ Run SQL (in Supabase SQL Editor)

**Copy from `SUPABASE_SETUP.md` Step 4 and run:**
- Creates tables: properties, users, bookings
- Sets up indexes and triggers
- Enables RLS policies

### 5️⃣ Add Sample Data

**Copy from `SUPABASE_SETUP.md` Step 5 and run:**
- Inserts 2 sample properties

### 6️⃣ Restart Dev Server
```bash
npm run dev
```

## ✅ You're Done!

Your app is now connected to Supabase!

## 📚 What You Can Do Now

### In Your Components:
```typescript
import { useProperties } from '@/hooks/useProperties';

const { properties, loading, addProperty, updateProperty, deleteProperty } = useProperties();
```

### Direct Operations:
```typescript
import { propertyOperations } from '@/lib/supabaseOperations';

// Fetch all
const properties = await propertyOperations.getAll();

// Add new
await propertyOperations.create(propertyData);

// Update
await propertyOperations.update(id, updates);

// Delete
await propertyOperations.delete(id);
```

## 🔧 Files Created

- ✅ `lib/supabase.ts` - Client & types
- ✅ `lib/supabaseOperations.ts` - CRUD operations
- ✅ `hooks/useProperties.ts` - React hook
- ✅ `.env.local.example` - Template
- ✅ `SUPABASE_SETUP.md` - Full guide
- ✅ `INTEGRATION_GUIDE.md` - Usage examples

## 🎯 Next Steps

1. Update admin page to use `useProperties` hook
2. Update properties page to fetch from Supabase
3. Update property details to use real data
4. Add user authentication
5. Implement booking system

## 🆘 Need Help?

- **Full Setup**: See `SUPABASE_SETUP.md`
- **Usage Examples**: See `INTEGRATION_GUIDE.md`
- **Supabase Docs**: https://supabase.com/docs

## 🐛 Common Issues

**"Failed to fetch"**
→ Check `.env.local` has correct keys

**"Permission denied"**
→ Run RLS policies SQL from Step 6 in SUPABASE_SETUP.md

**"No data showing"**
→ Run sample data SQL from Step 5 in SUPABASE_SETUP.md
