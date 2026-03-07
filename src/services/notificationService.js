// src/services/notificationService.js
import {
  collection, addDoc, getDocs, updateDoc, doc,
  query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const NOTIF_COL = 'notifications';

export const addNotification = async ({ userId, message, type = 'info' }) => {
  await addDoc(collection(db, NOTIF_COL), {
    userId,
    message,
    type,
    read: false,
    date: serverTimestamp(),
  });
};

export const getMyNotifications = async (userId) => {
  const snap = await getDocs(
    query(collection(db, NOTIF_COL), where('userId', '==', userId), orderBy('date', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const markNotificationRead = async (notifId) => {
  await updateDoc(doc(db, NOTIF_COL, notifId), { read: true });
};

export const markAllRead = async (userId) => {
  const snap = await getDocs(
    query(collection(db, NOTIF_COL), where('userId', '==', userId), where('read', '==', false))
  );
  const updates = snap.docs.map(d => updateDoc(doc(db, NOTIF_COL, d.id), { read: true }));
  await Promise.all(updates);
};
