import { NextResponse } from 'next/server';
import { firebaseBookingOperations, firebasePropertyOperations } from '@/lib/firebaseOperations';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    console.log('📥 Fetching bookings for user:', params.userId);
    
    const bookings = await firebaseBookingOperations.getByUserId(params.userId);
    console.log('✅ Fetched bookings:', bookings.length);

    // Fetch property details for each booking
    const bookingsWithProperties = await Promise.all(
      bookings.map(async (booking) => {
        try {
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
        } catch (propError) {
          console.error('⚠️ Error fetching property for booking:', booking.id, propError);
          // Return booking without property details if property fetch fails
          return {
            ...booking,
            property: null,
          };
        }
      })
    );

    console.log('✅ Returning bookings with properties:', bookingsWithProperties.length);
    return NextResponse.json(bookingsWithProperties);
  } catch (error: any) {
    console.error('❌ Error fetching user bookings:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch bookings',
        code: error.code,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
