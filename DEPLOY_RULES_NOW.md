# 🚨 DEPLOY FIRESTORE RULES NOW

## The Problem
You're getting "Missing or insufficient permissions" because Firestore rules haven't been deployed yet.

## Quick Fix (2 minutes)

### Step 1: Deploy Firestore Rules

1. Go to: https://console.firebase.google.com/project/pguncle-e35e6/firestore/rules

2. **Replace ALL the rules** with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Properties collection - public read, authenticated write
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"** button (top right)

### Step 2: Deploy Storage Rules

1. Go to: https://console.firebase.google.com/project/pguncle-e35e6/storage/pguncle-e35e6.firebasestorage.app/rules

2. **Replace ALL the rules** with this:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Properties folder - public read, authenticated write
    match /properties/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User uploads folder
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"** button (top right)

### Step 3: Refresh Your App

1. Go back to your app: http://localhost:3000
2. Refresh the page (Cmd+R or Ctrl+R)
3. ✅ Properties should load now!

## That's It!

Once you publish both rules, your app will work perfectly. The rules allow:
- ✅ Anyone to read properties (public)
- ✅ Authenticated users to create/edit properties
- ✅ Authenticated users to upload images
- ✅ Users to manage their own bookings

## Still Not Working?

If you still see errors after deploying rules:

1. **Check rules are published**: Look for green "Published" status in Firebase Console
2. **Wait 10 seconds**: Rules take a few seconds to propagate
3. **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. **Check browser console**: Look for any other errors

## Quick Links

- Firestore Rules: https://console.firebase.google.com/project/pguncle-e35e6/firestore/rules
- Storage Rules: https://console.firebase.google.com/project/pguncle-e35e6/storage/pguncle-e35e6.firebasestorage.app/rules
- Authentication: https://console.firebase.google.com/project/pguncle-e35e6/authentication/users
- Firestore Data: https://console.firebase.google.com/project/pguncle-e35e6/firestore/data

Deploy the rules now and your app will work! 🚀
