const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. CONFIGURATION
// You need a service account key JSON file from Firebase
const serviceAccountPath = path.resolve(__dirname, '../firebase-service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ Firebase service account file not found at " + serviceAccountPath);
  console.log("Please download it from Firebase Console > Project Settings > Service Accounts.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL; // e.g., 'https://xyzcompany.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Supabase environment variables missing.");
  console.log("Please provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Initialize Supabase Admin Client (bypass RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// 2. MIGRATION FUNCTIONS
async function migrateUsers() {
  console.log('Migrating Users...');
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  
  const users = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      firebase_uid: doc.id,
      email: data.email,
      full_name: data.fullName || data.full_name || '',
      phone: data.phone || null,
      role: data.role || 'user',
      image: data.image || null,
      created_at: data.createdAt?.toDate() || new Date(),
    };
  });

  if (users.length === 0) return { map: {} };

  const { data, error } = await supabase
    .from('users')
    .upsert(users, { onConflict: 'email', ignoreDuplicates: true })
    .select();

  if (error) {
    console.error('❌ Error migrating users:', error);
    throw error;
  }
  
  console.log(`✅ Migrated ${users.length} users.`);
  
  // Create a map of Firebase ID to Supabase ID for references later
  const userMap = {};
  data.forEach(u => {
    if (u.firebase_uid) userMap[u.firebase_uid] = u.id;
  });
  return { map: userMap };
}

async function migrateProperties() {
  console.log('Migrating Properties...');
  const propertiesRef = db.collection('properties');
  const snapshot = await propertiesRef.get();
  
  const properties = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      firebase_id: doc.id,
      name: data.name,
      location: data.location || null,
      address: data.address || null,
      city: data.city || null,
      rating: data.rating || 0,
      reviews: data.reviews || 0,
      type: data.type || null,
      availability: data.availability || null,
      image: data.image || null,
      images: data.images || [],
      price: data.price || 0,
      gender: data.gender || null,
      description: data.description || null,
      amenities: data.amenities || [],
      house_rules: data.houseRules || [],
      nearby_places: data.nearbyPlaces || [],
      coordinates: data.coordinates || null,
      room_types: data.roomTypes || [],
      is_active: data.isActive !== undefined ? data.isActive : true,
      created_at: data.createdAt?.toDate() || new Date(),
      updated_at: data.updatedAt?.toDate() || new Date(),
    };
  });

  if (properties.length === 0) return { map: {} };

  const { data, error } = await supabase
    .from('properties')
    .upsert(properties, { onConflict: 'firebase_id' })
    .select();

  if (error) {
    console.error('❌ Error migrating properties:', error);
    throw error;
  }
  
  console.log(`✅ Migrated ${properties.length} properties.`);
  
  const propertyMap = {};
  data.forEach(p => {
    propertyMap[p.firebase_id] = p.id;
  });
  return { map: propertyMap };
}

async function migrateBookings(userMap, propertyMap) {
  console.log('Migrating Bookings...');
  const bookingsRef = db.collection('bookings');
  const snapshot = await bookingsRef.get();
  
  const bookings = [];
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const supaUserId = userMap[data.userId];
    const supaPropertyId = propertyMap[data.propertyId];
    
    if (supaUserId && supaPropertyId) {
       bookings.push({
        firebase_id: doc.id,
        user_id: supaUserId,
        property_id: supaPropertyId,
        room_type: data.roomType || null,
        check_in_date: data.checkInDate || data.moveInDate ? new Date(data.checkInDate || data.moveInDate) : null,
        duration: data.duration || null,
        total_amount: data.totalAmount || null,
        special_requests: data.specialRequests || null,
        status: data.status || 'pending',
        payment_id: data.paymentId || null,
        payment_type: data.paymentType || null,
        monthly_rent: data.monthlyRent || null,
        deposit_amount: data.depositAmount || null,
        paid_months: data.paidMonths || null,
        next_payment_due: data.nextPaymentDue ? new Date(data.nextPaymentDue) : null,
        monthly_payments: data.monthlyPayments || [],
        created_at: data.createdAt?.toDate() || new Date(),
      });
    } else {
        console.warn(`Skipping booking ${doc.id} due to missing user (${data.userId}) or property (${data.propertyId}) mapping.`);
    }
  });

  if (bookings.length === 0) return { map: {} };

  const { data, error } = await supabase
    .from('bookings')
    .upsert(bookings, { onConflict: 'firebase_id' })
    .select();

  if (error) {
    console.error('❌ Error migrating bookings:', error);
    throw error;
  }
  
  console.log(`✅ Migrated ${bookings.length} bookings.`);
  
  const bookingMap = {};
  data.forEach(b => {
    bookingMap[b.firebase_id] = b.id;
  });
  return { map: bookingMap };
}

async function migratePayments(userMap, bookingMap) {
  console.log('Migrating Payments...');
  const paymentsRef = db.collection('payments');
  const snapshot = await paymentsRef.get();
  
  const payments = [];
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const supaUserId = userMap[data.userId];
    const supaBookingId = data.bookingId ? bookingMap[data.bookingId] : null;

    if (supaUserId) {
        payments.push({
            firebase_id: doc.id,
            user_id: supaUserId,
            booking_id: supaBookingId,
            order_id: data.orderId || null,
            payment_id: data.paymentId || null,
            signature: data.signature || null,
            amount: data.amount || 0,
            currency: data.currency || 'INR',
            status: data.status || 'pending',
            failure_reason: data.failureReason || null,
            created_at: data.createdAt?.toDate() || new Date(),
        })
    }
  });

  if (payments.length === 0) return;

  const { error } = await supabase
    .from('payments')
    .upsert(payments, { onConflict: 'firebase_id' });

  if (error) {
    console.error('❌ Error migrating payments:', error);
    throw error;
  }
  
  console.log(`✅ Migrated ${payments.length} payments.`);
}

async function run() {
  console.log('🚀 Starting migration...');
  try {
    const { map: userMap } = await migrateUsers();
    const { map: propertyMap } = await migrateProperties();
    const { map: bookingMap } = await migrateBookings(userMap, propertyMap);
    await migratePayments(userMap, bookingMap);
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

run();
