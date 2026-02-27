import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Property, User, Booking, Payment } from '@/types';

// ============================================
// PROPERTY OPERATIONS
// ============================================

export const firebasePropertyOperations = {
  async getAll(): Promise<Property[]> {
    try {
      const propertiesRef = collection(db, 'properties');
      const snapshot = await getDocs(propertiesRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
      })) as Property[];
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Property | null> {
    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString(),
      } as Property;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  async getByCity(city: string): Promise<Property[]> {
    try {
      const propertiesRef = collection(db, 'properties');
      const q = query(propertiesRef, where('city', '==', city));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
      })) as Property[];
    } catch (error) {
      console.error('Error fetching properties by city:', error);
      throw error;
    }
  },

  async create(propertyData: Omit<Property, 'id'>): Promise<Property> {
    try {
      console.log('🔥 Firebase: Creating property in Firestore...');
      const propertiesRef = collection(db, 'properties');
      
      console.log('🔥 Firebase: Adding document to collection...');
      const docRef = await addDoc(propertiesRef, {
        ...propertyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log('🔥 Firebase: Document created with ID:', docRef.id);
      console.log('🔥 Firebase: Fetching created document...');
      const newDoc = await getDoc(docRef);
      
      console.log('🔥 Firebase: Document fetched successfully');
      return {
        id: newDoc.id,
        ...newDoc.data(),
        createdAt: newDoc.data()?.createdAt?.toDate?.()?.toISOString(),
        updatedAt: newDoc.data()?.updatedAt?.toDate?.()?.toISOString(),
      } as Property;
    } catch (error: any) {
      console.error('❌ Firebase Error creating property:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Full error:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  async update(id: string, updates: Partial<Property>): Promise<Property> {
    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      const updated = await getDoc(docRef);
      return {
        id: updated.id,
        ...updated.data(),
        createdAt: updated.data()?.createdAt?.toDate?.()?.toISOString(),
        updatedAt: updated.data()?.updatedAt?.toDate?.()?.toISOString(),
      } as Property;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'properties', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  async toggleActive(id: string, isActive: boolean): Promise<Property> {
    return this.update(id, { isActive });
  },
};

// ============================================
// USER OPERATIONS
// ============================================

export const firebaseUserOperations = {
  async getAll(): Promise<User[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getByEmail(email: string): Promise<User | null> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as User;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async create(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const usersRef = collection(db, 'users');
      const docRef = await addDoc(usersRef, {
        ...userData,
        createdAt: serverTimestamp(),
      });
      
      const newDoc = await getDoc(docRef);
      return {
        id: newDoc.id,
        ...newDoc.data(),
      } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      
      const updated = await getDoc(docRef);
      return {
        id: updated.id,
        ...updated.data(),
      } as User;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};

// ============================================
// BOOKING OPERATIONS
// ============================================

export const firebaseBookingOperations = {
  async create(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const docRef = await addDoc(bookingsRef, {
        ...bookingData,
        createdAt: serverTimestamp(),
      });
      
      const newDoc = await getDoc(docRef);
      return {
        id: newDoc.id,
        ...newDoc.data(),
        createdAt: newDoc.data()?.createdAt?.toDate?.()?.toISOString(),
      } as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  async getByUserId(userId: string): Promise<Booking[]> {
    try {
      console.log('🔍 Fetching bookings for user:', userId);
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef, 
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      
      console.log('📦 Found bookings:', snapshot.size);
      
      const bookings = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📋 Booking data:', doc.id, data);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        };
      }) as Booking[];
      
      // Sort by createdAt in memory (newest first)
      bookings.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      console.log('✅ Returning bookings:', bookings.length);
      return bookings;
    } catch (error: any) {
      console.error('❌ Error fetching user bookings:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      throw error;
    }
  },

  async getAll(): Promise<Booking[]> {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      })) as Booking[];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  async updateStatus(id: string, status: string): Promise<Booking> {
    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
      
      const updated = await getDoc(docRef);
      return {
        id: updated.id,
        ...updated.data(),
        createdAt: updated.data()?.createdAt?.toDate?.()?.toISOString(),
      } as Booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },
};

// ============================================
// PAYMENT OPERATIONS
// ============================================

export const firebasePaymentOperations = {
  async create(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
    try {
      const paymentsRef = collection(db, 'payments');
      const docRef = await addDoc(paymentsRef, {
        ...paymentData,
        createdAt: serverTimestamp(),
      });
      
      const newDoc = await getDoc(docRef);
      return {
        id: newDoc.id,
        ...newDoc.data(),
        createdAt: newDoc.data()?.createdAt?.toDate?.()?.toISOString(),
      } as Payment;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  async updateSuccess(orderId: string, paymentId: string, signature: string): Promise<Payment> {
    try {
      const paymentsRef = collection(db, 'payments');
      const q = query(paymentsRef, where('orderId', '==', orderId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Payment not found');
      }
      
      const docRef = doc(db, 'payments', snapshot.docs[0].id);
      await updateDoc(docRef, {
        paymentId,
        signature,
        status: 'success',
        updatedAt: serverTimestamp(),
      });
      
      const updated = await getDoc(docRef);
      return {
        id: updated.id,
        ...updated.data(),
        createdAt: updated.data()?.createdAt?.toDate?.()?.toISOString(),
      } as Payment;
    } catch (error) {
      console.error('Error updating payment success:', error);
      throw error;
    }
  },

  async updateFailed(orderId: string, reason: string): Promise<Payment> {
    try {
      const paymentsRef = collection(db, 'payments');
      const q = query(paymentsRef, where('orderId', '==', orderId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Payment not found');
      }
      
      const docRef = doc(db, 'payments', snapshot.docs[0].id);
      await updateDoc(docRef, {
        status: 'failed',
        failureReason: reason,
        updatedAt: serverTimestamp(),
      });
      
      const updated = await getDoc(docRef);
      return {
        id: updated.id,
        ...updated.data(),
        createdAt: updated.data()?.createdAt?.toDate?.()?.toISOString(),
      } as Payment;
    } catch (error) {
      console.error('Error updating payment failed:', error);
      throw error;
    }
  },

  async getByOrderId(orderId: string): Promise<Payment | null> {
    try {
      const paymentsRef = collection(db, 'payments');
      const q = query(paymentsRef, where('orderId', '==', orderId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      } as Payment;
    } catch (error) {
      console.error('Error fetching payment by order ID:', error);
      throw error;
    }
  },

  async getByUserId(userId: string): Promise<Payment[]> {
    try {
      const paymentsRef = collection(db, 'payments');
      const q = query(
        paymentsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      })) as Payment[];
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  },

  async getAll(): Promise<Payment[]> {
    try {
      const paymentsRef = collection(db, 'payments');
      const q = query(paymentsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      })) as Payment[];
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },
};
