import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    adminPassword: !!process.env.ADMIN_PASSWORD,
    razorpayKeyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    razorpaySecret: !!process.env.RAZORPAY_KEY_SECRET,
    smtpHost: !!process.env.SMTP_HOST,
    smtpPort: !!process.env.SMTP_PORT,
    smtpUser: !!process.env.SMTP_USER,
    smtpPass: !!process.env.SMTP_PASS,
    smtpFrom: !!process.env.SMTP_FROM,
  };

  const allRequired = envCheck.supabaseUrl && envCheck.supabaseKey;

  return NextResponse.json({
    status: allRequired ? 'success' : 'error',
    message: allRequired 
      ? 'All required environment variables are set' 
      : 'Missing required environment variables',
    variables: envCheck,
    required: {
      supabaseUrl: envCheck.supabaseUrl,
      supabaseKey: envCheck.supabaseKey,
    },
    optional: {
      adminPassword: envCheck.adminPassword,
      razorpay: envCheck.razorpayKeyId && envCheck.razorpaySecret,
      smtp: envCheck.smtpHost && envCheck.smtpPort && envCheck.smtpUser && envCheck.smtpPass,
    },
  });
}
