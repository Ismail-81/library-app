// src/pages/admin/ManageBooks.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBooks, deleteBook, getAllCategories } from '../../services/bookService';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { SearchBar, LoadingSpinner, ConfirmDialog, EmptyState } from '../../components/common';
import { exportBooksToExcel } from '../../utils/exportUtils';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    const [b, c] = await Promise.all([getAllBooks(), getAllCategories()]);
    setBooks(b); setCategories(c); setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBook(deleteId);
      toast.success('Book deleted successfully');
      load();
    } catch { toast.error('Failed to delete book'); }
  };

  const filtered = books.filter(b => {
    const term = search.toLowerCase();
    const matchS = !search || b.title?.toLowerCase().includes(term) || b.author?.toLowerCase().includes(term);
    const matchC = !selectedCat || b.category === selectedCat;
    return matchS && matchC;
  });

  const safeDate = (val) => {
    if (!val) return '—';
    try { return format(val?.toDate ? val.toDate() : new Date(val), 'MMM d, yyyy'); } catch { return '—'; }
  };

  return (
    <DashboardLayout>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Manage Books</h1>
          <p className="page-subtitle">{books.length} books in collection</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportBooksToExcel(filtered)} className="btn-ghost border border-ink-200 text-xs gap-1 flex items-center">
            📤 Export Excel
          </button>
          <Link to="/admin/books/add" className="btn-secondary text-sm">+ Add Book</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search books..." className="flex-1" />
        <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} className="input-field sm:w-48">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.categoryName || c.name}>{c.categoryName || c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          title="No books found"
          action={<Link to="/admin/books/add" className="btn-primary">Add First Book</Link>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Title / Author</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Total</th>
                  <th className="table-header">Available</th>
                  <th className="table-header">Added</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(book => (
                  <tr key={book.id} className="hover:bg-ink-50/50 transition-colors">
                    <td className="table-cell">
                      <p className="font-medium text-ink-900">{book.title}</p>
                      <p className="text-xs text-ink-500">{book.author}</p>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs px-2 py-0.5 bg-ink-100 text-ink-700 rounded-full">{book.category}</span>
                    </td>
                    <td className="table-cell font-mono">{book.quantity}</td>
                    <td className="table-cell">
                      <span className={book.available > 0 ? 'badge-available' : 'badge-unavailable'}>
                        {book.available}
                      </span>
                    </td>
                    <td className="table-cell text-ink-500">{safeDate(book.createdAt)}</td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                          className="text-xs px-3 py-1.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors font-medium">
                          Edit
                        </button>
                        <button onClick={() => setDeleteId(book.id)}
                          className="text-xs px-3 py-1.5 rounded bg-crimson-100 text-crimson-800 hover:bg-crimson-200 transition-colors font-medium">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        confirmText="Delete Book"
      />
    </DashboardLayout>
  );
};
