# Firebase Setup Guide

## Overview

Your application has been successfully integrated with Firebase. Follow these steps to complete the setup and deploy your application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter your project name (e.g., "EduHub Portal")
4. Accept the terms and click "Create project"
5. Wait for the project to be created

## Step 2: Register Your Web App

1. In the Firebase console, click the Web icon (</>)
2. Enter an app nickname (e.g., "EduHub Web")
3. Check "Also set up Firebase Hosting" if desired
4. Click "Register app"
5. Copy the Firebase configuration code

## Step 3: Add Firebase Credentials to .env

1. Open `.env` file in your project root
2. Replace the placeholder values with your Firebase credentials from Step 2:

```
VITE_FIREBASE_API_KEY=your_api_key_from_firebase
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 4: Enable Authentication

1. In Firebase console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" authentication
3. Click "Save"

## Step 5: Create Firestore Database

1. Go to "Firestore Database" in Firebase console
2. Click "Create database"
3. Select "Start in test mode" (for development; use production rules for deployment)
4. Choose your region and click "Create"

## Step 6: Set Up Firestore Security Rules

Replace the default Firestore rules with the following security rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection - only authenticated users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Batches collection - admins only
    match /batches/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Students collection - admins can manage, students can read their own
    match /students/{studentId} {
      allow read: if request.auth != null && (
        request.auth.uid == get(/databases/$(database)/documents/students/$(studentId)).data.userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Content collection
    match /content/{contentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Videos collection
    match /videos/{videoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Tests collection
    match /tests/{testId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

  }
}
```

## Step 7: Set Up Storage (Optional - for file uploads)

1. Go to "Storage" in Firebase console
2. Click "Get started"
3. Start in test mode and click "Next"
4. Click "Done"

### Storage Security Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 100 * 1024 * 1024; // 100MB limit
    }
  }
}
```

## Step 8: Test Your Application

1. Run `npm run dev` to start your development server
2. Go to http://localhost:5173
3. Create a new user account using email/password authentication
4. Test the login functionality

## Step 9: Adding Test Data

Once your Firestore database is set up, you can add test data:

### Create Users:

```javascript
// In Firebase Console > Firestore > Collections > users
{
  email: "admin@example.com",
  name: "Admin User",
  role: "admin"
}

{
  email: "student@example.com",
  name: "John Doe",
  role: "student",
  studentId: "STU2024001",
  batchId: "batch1"
}
```

### Create Batches:

```javascript
{
  name: "Morning Batch",
  description: "Classes from 6:00 AM to 12:00 PM",
  schedule: "Monday to Friday, 6:00 AM - 12:00 PM",
  createdDate: "2024-01-01",
  studentCount: 0
}
```

## Step 10: Build and Deploy

```bash
# Build the project
npm run build

# Deploy to Firebase Hosting (if enabled)
firebase deploy
```

## Troubleshooting

### Firebase configuration errors

- Make sure your `.env` file has the correct credentials
- Verify that VITE\_ prefix is used for Vite environment variables
- Restart your dev server after changing `.env`

### Authentication not working

- Ensure "Email/Password" is enabled in Firebase Authentication
- Check that user document exists in the "users" collection in Firestore

### Firestore permission denied

- Check your security rules match the ones provided above
- Ensure you're logged in as an authenticated user
- For test mode, allow all unauthenticated access temporarily

### Video/file uploads not working

- Ensure Cloud Storage is enabled
- Check storage security rules
- Verify file size limits are appropriate

## Important Security Notes

1. **Never commit `.env` to version control** - Add it to `.gitignore`
2. **Before production**:
   - Switch from test mode to production mode in Firestore
   - Review and restrict security rules appropriately
   - Enable email verification for user accounts
   - Set up proper authentication flow with password reset
   - Consider enabling 2FA for admin accounts

3. **Environment variables** should never contain secrets in production. Use Firebase security rules instead.

## API Reference

All data operations are now async and return Promises. Examples:

```typescript
// Add a student
await addStudent({
  studentId: "STU2024001",
  name: "John Doe",
  email: "john@example.com",
  enrolledDate: "2024-01-15",
  status: "active",
  batchId: "batch1",
});

// Update a batch
await updateBatch("batch1", {
  studentCount: 5,
});

// Delete content
await deleteContent("content1");
```

## Support

For more information:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
