// Property Types
export interface Property {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  rating: number;
  reviews: number;
  type: string;
  availability: string;
  image: string;
  images?: string[];
  price: number;
  gender?: string;
  description?: string;
  amenities: Amenity[];
  houseRules: string[];
  nearbyPlaces: NearbyPlace[];
  coordinates: {
    lat: number;
    lng: number;
  };
  roomTypes: RoomType[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomType {
  type: string;
  price: number;
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  available?: boolean;
  description?: string;
  features?: string[];
  images?: string[];
  beds?: number;
}

export interface Amenity {
  name: string;
  icon?: string;
  available: boolean;
}

export interface NearbyPlace {
  name: string;
  distance: string;
  type?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  fullName?: string;
  phone?: string;
  role: 'user' | 'admin';
  image?: string;
  createdAt?: string;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  roomType: string;
  checkInDate: string;
  duration: number;
  totalAmount: number;
  specialRequests?: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentId?: string;
  createdAt?: string;
  paymentType?: 'full' | 'monthly';
  monthlyRent?: number;
  depositAmount?: number;
  paidMonths?: number;
  nextPaymentDue?: string;
  monthlyPayments?: MonthlyPayment[];
}

export interface MonthlyPayment {
  month: number;
  amount: number;
  paymentId?: string;
  paidAt?: string;
  status: 'pending' | 'paid';
  dueDate: string;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  bookingId?: string;
  orderId: string;
  paymentId?: string;
  signature?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  failureReason?: string;
  createdAt?: string;
}
