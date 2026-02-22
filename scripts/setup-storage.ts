/**
 * Setup script to create Supabase storage bucket
 * Run this once to create the property-images bucket
 * 
 * Usage: npx tsx scripts/setup-storage.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupStorage() {
  console.log('🚀 Setting up Supabase storage...\n');

  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      return;
    }

    const bucketExists = buckets?.some(b => b.name === 'property-images');

    if (bucketExists) {
      console.log('✅ Bucket "property-images" already exists!');
      return;
    }

    // Create the bucket
    console.log('📦 Creating bucket "property-images"...');
    const { data: bucket, error: createError } = await supabase.storage.createBucket('property-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    });

    if (createError) {
      console.error('❌ Error creating bucket:', createError.message);
      return;
    }

    console.log('✅ Bucket created successfully!');
    console.log('\n📝 Now you need to add storage policies in Supabase Dashboard:');
    console.log('\n1. Go to Storage → property-images → Policies');
    console.log('2. Add these policies:\n');
    console.log('-- Public Read Access');
    console.log(`CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'property-images' );\n`);
    console.log('-- Authenticated Upload');
    console.log(`CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'property-images' );\n`);
    console.log('-- Authenticated Delete');
    console.log(`CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING ( bucket_id = 'property-images' );\n`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupStorage();
