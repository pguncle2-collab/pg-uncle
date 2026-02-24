import { NextResponse } from 'next/server';
import { firebasePropertyOperations } from '@/lib/firebaseOperations';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isActive } = await request.json();
    const updated = await firebasePropertyOperations.toggleActive(params.id, isActive);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error toggling property status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to toggle property status' },
      { status: 500 }
    );
  }
}
