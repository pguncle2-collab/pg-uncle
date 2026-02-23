import { NextRequest, NextResponse } from 'next/server';
import { serverCache } from '@/lib/serverCache';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication check here
    const { key } = await request.json().catch(() => ({}));
    
    if (key) {
      // Clear specific cache key
      serverCache.delete(key);
      return NextResponse.json({ 
        success: true, 
        message: `Cache key '${key}' cleared` 
      });
    } else {
      // Clear all cache
      serverCache.clear();
      return NextResponse.json({ 
        success: true, 
        message: 'All cache cleared' 
      });
    }
  } catch (error: any) {
    console.error('Cache clear error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = serverCache.getStats();
    return NextResponse.json({ 
      success: true, 
      stats 
    });
  } catch (error: any) {
    console.error('Cache stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}
