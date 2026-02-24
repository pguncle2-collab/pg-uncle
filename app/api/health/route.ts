import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export async function GET() {
  try {
    // Test Firebase connection
    const testQuery = query(collection(db, 'properties'), limit(1));
    await getDocs(testQuery);
    
    return NextResponse.json({
      status: 'ok',
      database: 'firebase',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'firebase',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
