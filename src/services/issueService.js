// src/services/issueService.js
import {
  collection, doc, addDoc, updateDoc,
  getDocs, getDoc, query, where, orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { decrementAvailable, incrementAvailable, getBook } from './bookService';
import { addNotification } from './notificationService';

const ISSUED_COL = 'issuedBooks';

/**
 * Issue a book to a user.
 * - Validates availability
 * - Creates issuedBooks record
 * - Decrements book.available
 * - Sends notification
 */
export const issueBook = async ({ userId, bookId, userName, bookTitle }) => {
  const book = await getBook(bookId);
  if (!book) throw new Error('Book not found.');
  if (book.available <= 0) throw new Error('No copies available for this book.');

  // Check if user already has this book issued
  const existingQ = query(
    collection(db, ISSUED_COL),
    where('userId', '==', userId),
    where('bookId', '==', bookId),
    where('status', '==', 'issued')
  );
  const existing = await getDocs(existingQ);
  if (!existing.empty) throw new Error('You already have this book issued.');

  const issueDate = new Date();
  const returnDate = new Date(issueDate);
  returnDate.setDate(returnDate.getDate() + 14); // 2 weeks borrow period

  const ref = await addDoc(collection(db, ISSUED_COL), {
    userId,
    bookId,
    bookTitle: book.title,
    bookAuthor: book.author,
    userName,
    issueDate: serverTimestamp(),
    returnDate: returnDate.toISOString(),
    status: 'issued',
    createdAt: serverTimestamp(),
  });

  await decrementAvailable(bookId);

  await addNotification({
    userId,
    message: `You have successfully borrowed "${book.title}". Due date: ${returnDate.toLocaleDateString()}.`,
    type: 'issue',
  });

  return ref;
};

/**
 * Return a book.
 */
export const returnBook = async (issueId) => {
  const issueRef = doc(db, ISSUED_COL, issueId);
  const issueSnap = await getDoc(issueRef);
  if (!issueSnap.exists()) throw new Error('Issue record not found.');

  const issueData = issueSnap.data();
  if (issueData.status === 'returned') throw new Error('Book already returned.');

  await updateDoc(issueRef, {
    status: 'returned',
    actualReturnDate: serverTimestamp(),
  });

  await incrementAvailable(issueData.bookId);

  await addNotification({
    userId: issueData.userId,
    message: `You have returned "${issueData.bookTitle}". Thank you!`,
    type: 'return',
  });
};

/** Get all issued books for a specific user */
export const getMyIssuedBooks = async (userId) => {
  const snap = await getDocs(
    query(collection(db, ISSUED_COL), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/** Get currently active (not returned) issues for a user */
export const getActiveIssues = async (userId) => {
  const snap = await getDocs(
    query(
      collection(db, ISSUED_COL),
      where('userId', '==', userId),
      where('status', '==', 'issued')
    )
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/** Get all issued books (admin) */
export const getAllIssuedBooks = async () => {
  const snap = await getDocs(
    query(collection(db, ISSUED_COL), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/** Get currently active issues (admin) */
export const getAllActiveIssues = async () => {
  const snap = await getDocs(
    query(collection(db, ISSUED_COL), where('status', '==', 'issued'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

/** Check if a specific book is issued by user */
export const isBookIssuedByUser = async (userId, bookId) => {
  const snap = await getDocs(
    query(
      collection(db, ISSUED_COL),
      where('userId', '==', userId),
      where('bookId', '==', bookId),
      where('status', '==', 'issued')
    )
  );
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};
