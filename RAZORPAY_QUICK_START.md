# 🚀 Razorpay Quick Start - 6 Minutes Setup

## ⚡ Super Fast Setup Guide

### Step 1: Get Razorpay Keys (2 min)

1. Go to: https://dashboard.razorpay.com/signup
2. Sign up (use Google for faster signup)
3. Go to: Settings → API Keys
4. Copy your **Key ID** and **Key Secret**

### Step 2: Update .env.local (1 min)

Open `.env.local` and replace:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
```

### Step 3: Run SQL (2 min)

1. Go to: https://supabase.com/dashboard/project/ijwbczqupzocgvuylanr/sql
2. Copy all from `RAZORPAY_SQL_SETUP.sql`
3. Paste and click **Run**

### Step 4: Restart Server (30 sec)

```bash
# Press Ctrl+C to stop
npm run dev
```

### Step 5: Test Payment (1 min)

1. Go to: http://localhost:3000
2. Click any property
3. Click "💳 Book Now & Pay"
4. Fill form and proceed
5. Use test card: **4111 1111 1111 1111**
6. CVV: **123**, Expiry: **12/25**
7. Done! 🎉

---

## 💳 Test Cards

### Success:
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

### Failure:
```
Card: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

---

## ✅ What You Get

- ✅ Complete booking flow
- ✅ Secure payment processing
- ✅ Payment verification
- ✅ Success confirmation
- ✅ Database tracking
- ✅ Error handling

---

## 🎯 That's It!

Your payment system is ready to accept bookings!

**Need Help?** Check `RAZORPAY_SETUP_GUIDE.md` for detailed instructions.
