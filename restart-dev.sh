#!/bin/bash

echo "🛑 Stopping any running servers..."
pkill -f "next dev" 2>/dev/null || true

echo "🧹 Cleaning build cache..."
rm -rf .next

echo "✅ Verifying Razorpay test keys..."
if grep -q "rzp_test_" .env.local; then
    echo "✅ Test keys found in .env.local"
    grep "RAZORPAY" .env.local
else
    echo "⚠️  WARNING: Test keys not found!"
    echo "Make sure your .env.local has:"
    echo "NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_SLIaShBhO8I1oW"
    echo "RAZORPAY_KEY_SECRET=7VT0UZbQLwwB0EC7KOrBeeM"
fi

echo ""
echo "🚀 Starting development server..."
echo "📝 Open http://localhost:3000 in your browser"
echo "🔍 Open browser console (F12) to see logs"
echo ""
echo "💳 Test card: 4111 1111 1111 1111"
echo "📅 Expiry: 12/25"
echo "🔐 CVV: 123"
echo ""

npm run dev
