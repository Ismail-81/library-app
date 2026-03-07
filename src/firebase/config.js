// src/firebase/config.js
// =====================================================
// IMPORTANT: Replace these values with your own Firebase project credentials.
// Go to: https://console.firebase.google.com
// Create a project → Add Web App → Copy the config object below.
// Also enable:
//   - Authentication (Email/Password)
//   - Firestore Database
// =====================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDyiNAliI99okd3qhCOFiUrYrn2X_A-icI",
  authDomain: "library-management-syste-d6e4c.firebaseapp.com",
  projectId: "library-management-syste-d6e4c",
  storageBucket: "library-management-syste-d6e4c.firebasestorage.app",
  messagingSenderId: "177071292972",
  appId: "1:177071292972:web:4a1d045a7932a881b2c789"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
