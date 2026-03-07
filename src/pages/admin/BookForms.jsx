// src/pages/admin/AddBook.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addBook, updateBook, getBook, getAllCategories } from '../../services/bookService';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner } from '../../components/common';
import toast from 'react-hot-toast';

const BookForm = ({ initialData, onSubmit, loading, title, submitLabel }) => {
  const [form, setForm] = useState(initialData);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories().then(c => setCategories(c));
  }, []);

  useEffect(() => { setForm(initialData); }, [JSON.stringify(initialData)]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.category) return toast.error('Please fill all required fields');
    if (form.quantity < 1) return toast.error('Quantity must be at least 1');
    onSubmit(form);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="page-header">
          <h1 className="page-title">{title}</h1>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Book Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="input-field" placeholder="Enter book title" required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Author *</label>
                <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                  className="input-field" placeholder="Author name" required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Category *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="input-field" required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.categoryName || c.name}>{c.categoryName || c.name}</option>)}
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="input-field min-h-[100px] resize-none" placeholder="Book description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Total Quantity *</label>
                <input type="number" min="1" value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">ISBN (optional)</label>
                <input type="text" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })}
                  className="input-field" placeholder="978-..." />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-secondary flex items-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />}
                {submitLabel}
              </button>
              <button type="button" onClick={() => history.back()} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

const EMPTY = { title: '', author: '', category: '', description: '', quantity: 1, isbn: '' };

export const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      await addBook(form);
      toast.success('Book added successfully!');
      navigate('/admin/books');
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return <BookForm initialData={EMPTY} onSubmit={handleSubmit} loading={loading} title="Add New Book" submitLabel="Add Book" />;
};

export const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    getBook(id).then(b => {
      if (b) setInitialData({ title: b.title || '', author: b.author || '', category: b.category || '',
        description: b.description || '', quantity: b.quantity || 1, isbn: b.isbn || '' });
    });
  }, [id]);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      await updateBook(id, form);
      toast.success('Book updated successfully!');
      navigate('/admin/books');
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  if (!initialData) return <DashboardLayout><div className="flex justify-center py-20"><LoadingSpinner /></div></DashboardLayout>;
  return <BookForm initialData={initialData} onSubmit={handleSubmit} loading={loading} title="Edit Book" submitLabel="Save Changes" />;
};
