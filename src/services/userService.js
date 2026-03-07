// src/services/userService.js
import {
  collection, getDocs, getDoc, doc, updateDoc,
  query, where, orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const getAllUsers = async () => {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
};

export const getUserById = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() };
};

export const updateUserRole = async (uid, role) => {
  await updateDoc(doc(db, 'users', uid), { role });
};

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), data);
};

export const getUsersByRole = async (role) => {
  const snap = await getDocs(query(collection(db, 'users'), where('role', '==', role)));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
};
