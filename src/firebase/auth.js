// src/firebase/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

/**
 * Register a new user with email/password.
 * Creates a Firestore user document with the given role.
 */
export const registerUser = async ({ name, email, password, role = 'student' }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  // Send verification email
  await firebaseSendEmailVerification(user);

  // Save user data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    name,
    email,
    role,
    createdAt: serverTimestamp(),
    isActive: true,
  });

  return user;
};

/**
 * Login with email/password.
 */
export const loginUser = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Logout the current user.
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Send email verification to the current user.
 */
export const sendEmailVerification = async () => {
  const user = auth.currentUser;
  if (user) {
    await firebaseSendEmailVerification(user);
  }
};

/**
 * Get user profile data from Firestore.
 */
export const getUserProfile = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid, ...docSnap.data() };
  }
  return null;
};

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
