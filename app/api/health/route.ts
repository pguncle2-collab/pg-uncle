import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Simple query to test database connection
    const { data, error } = await supabase
      .from('properties')
      .select('id')
      .limit(1);
    
    const duration = Date.now() - startTime;
    
    if (error) {
      return NextResponse.json(
        { 
          status: 'error',
          message: error.message,
          duration: `${duration}ms`
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: 'error',
        message: error.message || 'Database connection failed'
      },
      { status: 503 }
    );
  }
}
