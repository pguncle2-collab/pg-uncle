import { NextResponse } from 'next/server';
import { firebaseUserOperations } from '@/lib/firebaseOperations';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const updated = await firebaseUserOperations.update(userId, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}
