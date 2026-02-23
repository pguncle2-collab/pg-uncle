/**
 * Direct Supabase API calls using fetch
 * Fallback when Supabase client hangs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function fetchPropertiesDirect() {
  const url = `${SUPABASE_URL}/rest/v1/properties?select=id,name,location,address,city,rating,reviews,type,availability,image,images,price,amenities,room_types,is_active,created_at&is_active=eq.true&order=created_at.desc&limit=50`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  
  const data = await response.json();
  return data;
}
