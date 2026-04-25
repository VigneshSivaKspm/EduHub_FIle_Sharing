# Firebase Integration - Quick Start Guide

## 5-Minute Setup

### 1. Get Firebase Credentials (2 minutes)

1. Go to https://console.firebase.google.com
2. Click "Create Project" → Enter name → Continue
3. Disable Google Analytics → Create Project
4. Click Web icon (</>) on the project overview
5. Enter app name → Register app
6. Copy the configuration object

### 2. Update .env File (1 minute)

Open `.env` in your project root and replace with your credentials:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### 3. Enable Firebase Services (1 minute)

**Authentication:**

1. Firebase Console → Authentication → Sign-in method
2. Click "Email/Password" → Enable → Save

**Firestore Database:**

1. Firebase Console → Firestore Database → Create Database
2. Select "Start in test mode" → Select region → Create
3. Go to Rules tab, paste the rules from `FIREBASE_SETUP.md` → Publish

### 4. Start Your App (1 minute)

```bash
npm run dev
```

Visit http://localhost:5173 and test login!

---

## What Works Now

✅ Real user authentication  
✅ Persistent database (Firestore)  
✅ Student management  
✅ Batch management  
✅ Content distribution  
✅ Video/test management

---

## First Test Steps

1. Create a test user in Firebase Console:
   - Authentication → Users → Add User
   - Email: `admin@test.com`
   - Password: `password123`

2. Add user record in Firestore:
   - Create collection "users"
   - Add document with ID: `[USER_UID_FROM_FIREBASE]`
   - Add fields:
     ```
     {
       email: "admin@test.com",
       name: "Admin User",
       role: "admin"
     }
     ```

3. Go to app and login with those credentials

---

## Common Issues & Fixes

| Issue                     | Fix                                               |
| ------------------------- | ------------------------------------------------- |
| "Firebase config invalid" | Restart dev server after updating .env            |
| "Permission denied"       | Check security rules & user document in Firestore |
| "Login fails"             | Check user exists in both Auth & Firestore        |
| "Data not saving"         | Ensure Firestore database is created              |

---

## Next Steps

1. **Test complete flow** - Sign up, login, add students
2. **Add more test data** - Create batches, content, videos
3. **Review security rules** - Update for production
4. **Deploy** - Run `npm run build` then deploy to hosting

---

## Full Documentation

- `FIREBASE_SETUP.md` - Complete setup guide with security rules
- `FIREBASE_INTEGRATION_COMPLETE.md` - What changed and how to test

---

## Need Help?

Check the troubleshooting section in `FIREBASE_SETUP.md` or see the Firebase docs at firebase.google.com/docs
