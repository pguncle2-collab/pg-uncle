import { NextResponse } from 'next/server';
import { supabasePropertyOperations } from '@/lib/supabaseOperations';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const properties = await supabasePropertyOperations.getAll();
    return NextResponse.json(properties);
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 Creating property with data:', JSON.stringify(body, null, 2));
    
    const property = await supabasePropertyOperations.create(body);
    console.log('✅ Property created successfully:', property.id);
    
    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error creating property:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create property',
        code: error.code,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
