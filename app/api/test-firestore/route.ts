import { NextResponse } from 'next/server';
import { supabasePropertyOperations } from '@/lib/supabaseOperations';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test 1: Read from properties collection
    console.log('📖 Test 1: Reading properties...');
    const properties = await supabasePropertyOperations.getAll();
    console.log(`✅ Read successful! Found ${properties.length} properties`);
    
    return NextResponse.json({
      success: true,
      message: 'Supabase is working!',
      propertiesCount: properties.length,
    });
  } catch (error: any) {
    console.error('❌ Supabase test failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
