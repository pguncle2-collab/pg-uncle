import { NextResponse } from 'next/server';
import { supabasePropertyOperations } from '@/lib/supabaseOperations';

export async function GET() {
  try {
    // Test supabase connection
    await supabasePropertyOperations.getAll();
    
    return NextResponse.json({
      status: 'ok',
      database: 'supabase',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'supabase',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
