# 🚨 QUICK FIX: Update Storage Rules

## The Problem
You're getting 403 errors because Storage rules require authentication, but admin isn't authenticated with Firebase yet.

## Quick Fix (30 seconds)

### Update Storage Rules

1. **Go to**: https://console.firebase.google.com/project/pguncle-e35e6/storage/pguncle-e35e6.firebasestorage.app/rules

2. **Replace ALL rules** with this (temporarily allows all uploads):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Properties folder - allow all for now
    match /properties/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    
    // User uploads folder  
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. **Click "Publish"**

4. **Refresh your app** and try uploading again

## ✅ This Will Fix It!

Once you publish these rules, image uploads will work immediately.

## For Production

Later, you can make the rules more secure by requiring authentication:

```
match /properties/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null; // Require auth
}
```

But for now, let's get it working!

---

**Deploy the rules now and your image uploads will work!** 🚀
