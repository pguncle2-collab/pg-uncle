import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'defined' : 'undefined',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'defined' : 'undefined',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'defined' : 'undefined',
    allKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
  });
}
