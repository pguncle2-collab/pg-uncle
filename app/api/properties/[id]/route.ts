import { NextResponse } from 'next/server';
import { firebasePropertyOperations } from '@/lib/firebaseOperations';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await firebasePropertyOperations.getById(params.id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error: any) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await firebasePropertyOperations.update(params.id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await firebasePropertyOperations.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete property' },
      { status: 500 }
    );
  }
}
