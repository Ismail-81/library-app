// src/services/bookService.js
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, where, orderBy,
  serverTimestamp, increment
} from 'firebase/firestore';
import { db } from '../firebase/config';

const BOOKS_COL = 'books';
const CATEGORIES_COL = 'categories';

// ─── Books ────────────────────────────────────────────────────────────────────

export const addBook = async (bookData) => {
  return await addDoc(collection(db, BOOKS_COL), {
    ...bookData,
    available: bookData.quantity,
    createdAt: serverTimestamp(),
  });
};

export const updateBook = async (bookId, bookData) => {
  const ref = doc(db, BOOKS_COL, bookId);
  await updateDoc(ref, { ...bookData, updatedAt: serverTimestamp() });
};

export const deleteBook = async (bookId) => {
  await deleteDoc(doc(db, BOOKS_COL, bookId));
};

export const getBook = async (bookId) => {
  const snap = await getDoc(doc(db, BOOKS_COL, bookId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const getAllBooks = async () => {
  const snap = await getDocs(query(collection(db, BOOKS_COL), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getBooksByCategory = async (category) => {
  const snap = await getDocs(
    query(collection(db, BOOKS_COL), where('category', '==', category))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const searchBooks = async (searchTerm) => {
  // Client-side search after fetching all books (Firestore doesn't support full-text)
  const all = await getAllBooks();
  const term = searchTerm.toLowerCase();
  return all.filter(book =>
    book.title?.toLowerCase().includes(term) ||
    book.author?.toLowerCase().includes(term) ||
    book.category?.toLowerCase().includes(term) ||
    book.description?.toLowerCase().includes(term)
  );
};

export const decrementAvailable = async (bookId) => {
  await updateDoc(doc(db, BOOKS_COL, bookId), { available: increment(-1) });
};

export const incrementAvailable = async (bookId) => {
  await updateDoc(doc(db, BOOKS_COL, bookId), { available: increment(1) });
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const addCategory = async (categoryName) => {
  // store both fields to support older docs that may use `name`
  return await addDoc(collection(db, CATEGORIES_COL), {
    name: categoryName,
    categoryName,
    createdAt: serverTimestamp(),
  });
};

export const getAllCategories = async () => {
  const snap = await getDocs(collection(db, CATEGORIES_COL));
  return snap.docs.map(d => {
    const data = d.data();
    // normalize field for frontend consumption
    return {
      id: d.id,
      categoryName: data.categoryName || data.name || '',
      name: data.name || data.categoryName || '',
      ...data,
    };
  });
};

export const deleteCategory = async (categoryId) => {
  await deleteDoc(doc(db, CATEGORIES_COL, categoryId));
};
