# Authentication Setup Guide

## Overview
The app uses Firebase Authentication with Firestore for user profiles. Each user has:
- Firebase Auth account (email/password)
- Firestore `/users/{uid}` document with their profile and role

## Creating Accounts

### Method 1: Register via UI
1. Go to `/register`
2. Fill in details:
   - **Name**: Your full name
   - **Email**: Valid email address
   - **Role**: Select `Admin` or `Student`
   - **Password**: Min 6 characters
3. Click "Create Account"
4. Check email for verification (Firebase will send one)

### Method 2: Direct Registration (Using Console)
1. Go to Firebase Console → Authentication
2. Add new user with:
   - Email: admin user email
   - Password: temporary password
3. Go to Firestore Database → `users` collection
4. Create document with ID = user's UID
5. Add fields:
   ```json
   {
     "name": "Admin Name",
     "email": "admin@example.com",
     "role": "admin",
     "createdAt": serverTimestamp(),
     "isActive": true
   }
   ```

## Login Process

1. Go to `/login`
2. Enter email and password
3. System will:
   - Authenticate with Firebase
   - Fetch profile from Firestore
   - Determine role (admin or student)
   - Redirect to appropriate dashboard

## Firestore Security Rules

Current rules in `firestore.rules`:
- **Users collection**: Users can read/create their own profile, admins can update anyone's
- **Books collection**: Public read, admin write only
- **IssuedBooks**: Users can read/create their own, admins see all
- **Categories**: Public read, admin write only
- **Notifications**: Users can read/update their own

Deploy rules: Go to Firebase Console → Firestore → Rules → Replace with `firestore.rules` content → Publish

## Debug Logs

The app logs authentication events to console with `[AuthContext]`, `[Login]`, `[Register]`, `[ProtectedRoute]` prefixes.

Check browser console (F12) for detailed debug information:
- `[AuthContext]` - Profile fetching
- `[Login]` - Login flow
- `[Register]` - Account creation
- `[ProtectedRoute]` - Route access checks

## Common Issues

### Admin Can't Access Dashboard
1. Check `/login` console logs
2. Verify profile has `role: "admin"` in Firestore
3. Ensure Firestore rules are deployed
4. Check browser console for `[ProtectedRoute]` logs

### "User profile not found"
- Profile document doesn't exist in Firestore
- Create it manually in Firebase Console (see Method 2 above)

### "Missing or insufficient permissions"
- Firestore rules not deployed
- Deploy rules from `firestore.rules` file

### Login blank page
- AuthContext still loading, wait a moment
- Check browser console for errors

## Testing Credentials

**Demo accounts (from comments in code):**
- Admin: `admin@library.com` / `admin123`
- Student: `student@library.com` / `student123`

To create these test accounts:
1. Use `/register` page with these credentials
2. Make sure to select correct role (Admin/Student)
3. Firestore document will be auto-created

## Environment Variables

The Firebase config is in `src/firebase/config.js`. The API keys are configured. No additional environment variables needed for auth.

---

**Last Updated**: March 28, 2026
