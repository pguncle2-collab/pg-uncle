# 🧪 Test Razorpay Integration - Quick Guide

## ⚡ Quick Test (2 minutes)

### Step 1: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 2: Check Environment
Open browser console (F12) and run:
```javascript
console.log('Razorpay Key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
```

Should show: `rzp_live_SJGax4O5mAZXSv`

---

## 🎯 Test Booking Flow

1. **Go to**: http://localhost:3000
2. **Click** any property
3. **Select** a room type
4. **Click** "Book Now & Pay" button
5. **Fill** booking form:
   - Move-in date: Any future date
   - Duration: 6 months (to get discount)
   - Special requests: Optional
6. **Click** "Confirm Booking"

---

## ✅ What Should Happen

### If Everything Works:
1. Booking form submits
2. API creates Razorpay order
3. Razorpay payment popup opens
4. You see payment options (Cards, UPI, etc.)
5. **STOP HERE** - Don't complete payment (it's live!)

### If Something Fails:
Check browser console (F12) for errors.

---

## ⚠️ IMPORTANT: You're Using LIVE Credentials

**DO NOT complete test payments** - real money will be charged!

### Switch to Test Mode First:

1. Go to: https://dashboard.razorpay.com/
2. Toggle to **Test Mode** (top right)
3. Go to: Settings → API Keys
4. Copy **Test Key ID** and **Test Key Secret**
5. Update `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=test_secret_...
   ```
6. Restart server
7. Now you can test safely!

---

## 💳 Test Cards (Test Mode Only)

### Success:
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

### Failure:
```
Card: 4111 1111 1111 1112
CVV: 123
Expiry: 12/25
```

---

## 🔍 Verify Integration

### Check 1: Environment Variables
```bash
# In terminal
echo $NEXT_PUBLIC_RAZORPAY_KEY_ID
```
Should show: `rzp_live_SJGax4O5mAZXSv`

### Check 2: API Route
Test the order creation:
```bash
curl -X POST http://localhost:3000/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "currency": "INR"}'
```

Should return order details.

### Check 3: Razorpay Script
Open browser console:
```javascript
typeof Razorpay !== 'undefined'
```
Should return: `true` (after clicking booking button)

---

## 🐛 Common Issues

### Issue: "Payment gateway not configured"
**Fix**: 
- Check `.env.local` has credentials
- Restart server
- Clear browser cache

### Issue: Popup doesn't open
**Fix**:
- Disable popup blocker
- Check browser console for errors
- Verify Razorpay script loaded

### Issue: "Invalid key_id"
**Fix**:
- Verify key ID is correct (no spaces)
- Check if test/live mode matches
- Regenerate keys if needed

---

## ✅ Success Indicators

- [ ] Server starts without errors
- [ ] Booking form opens
- [ ] Form submits successfully
- [ ] Razorpay popup appears
- [ ] Payment options visible
- [ ] No console errors

---

## 🎉 Next Steps

1. **Switch to test mode** for safe testing
2. **Complete a test payment** with test card
3. **Verify booking** in database
4. **Check payment** in Razorpay dashboard
5. **Test refund flow** (optional)

---

## 📞 Need Help?

If something doesn't work:
1. Share the error from browser console
2. Share the error from terminal
3. Share screenshot of Razorpay dashboard
4. I'll help you fix it!

---

**Current Status**: 🟢 Integrated  
**Mode**: 🔴 LIVE (switch to test!)  
**Ready**: ✅ Yes

**REMEMBER**: Switch to test mode before testing payments!
