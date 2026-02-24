import { NextResponse } from 'next/server';
import { firebaseBookingOperations, firebasePropertyOperations } from '@/lib/firebaseOperations';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const bookings = await firebaseBookingOperations.getByUserId(params.userId);

    // Fetch property details for each booking
    const bookingsWithProperties = await Promise.all(
      bookings.map(async (booking) => {
        const property = await firebasePropertyOperations.getById(booking.propertyId);
        return {
          ...booking,
          property: property ? {
            id: property.id,
            name: property.name,
            location: property.location,
            address: property.address,
            city: property.city,
            image: property.image,
          } : null,
        };
      })
    );

    return NextResponse.json(bookingsWithProperties);
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
