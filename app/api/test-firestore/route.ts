import { NextResponse } from 'next/server';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('🧪 Testing Firestore connection...');
    
    // Test 1: Read from properties collection
    console.log('📖 Test 1: Reading properties...');
    const propertiesRef = collection(db, 'properties');
    const snapshot = await getDocs(propertiesRef);
    console.log(`✅ Read successful! Found ${snapshot.size} properties`);
    
    // Test 2: Write to test collection
    console.log('✍️ Test 2: Writing to test collection...');
    const testRef = collection(db, 'test');
    const testDoc = await addDoc(testRef, {
      message: 'Test from API',
      timestamp: serverTimestamp(),
      random: Math.random(),
    });
    console.log(`✅ Write successful! Doc ID: ${testDoc.id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Firestore is working!',
      propertiesCount: snapshot.size,
      testDocId: testDoc.id,
    });
  } catch (error: any) {
    console.error('❌ Firestore test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
