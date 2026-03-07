// src/utils/exportUtils.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

const toSafeDate = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (val?.toDate) return format(val.toDate(), 'yyyy-MM-dd HH:mm');
  if (val instanceof Date) return format(val, 'yyyy-MM-dd HH:mm');
  return String(val);
};

export const exportBooksToExcel = (books) => {
  const data = books.map((b, i) => ({
    '#': i + 1,
    Title: b.title || '',
    Author: b.author || '',
    Category: b.category || '',
    Description: b.description || '',
    'Total Copies': b.quantity || 0,
    'Available': b.available || 0,
    'Added On': toSafeDate(b.createdAt),
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Books');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `books_${Date.now()}.xlsx`);
};

export const exportIssuedBooksToExcel = (issues) => {
  const data = issues.map((b, i) => ({
    '#': i + 1,
    'Book Title': b.bookTitle || '',
    'Student': b.userName || '',
    'Issue Date': toSafeDate(b.issueDate),
    'Due Date': b.returnDate ? format(new Date(b.returnDate), 'yyyy-MM-dd') : '',
    'Actual Return': toSafeDate(b.actualReturnDate),
    'Status': b.status || '',
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Issued Books');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `issued_books_${Date.now()}.xlsx`);
};

export const exportUsersToExcel = (users) => {
  const data = users.map((u, i) => ({
    '#': i + 1,
    Name: u.name || '',
    Email: u.email || '',
    Role: u.role || '',
    'Joined': toSafeDate(u.createdAt),
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Users');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `users_${Date.now()}.xlsx`);
};

// CSV export
export const exportToCSV = (data, filename) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}_${Date.now()}.csv`);
};
