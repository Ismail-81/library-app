// src/pages/admin/AdminPages.jsx
import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole } from '../../services/userService';
import { addCategory, deleteCategory, getAllCategories, getAllBooks } from '../../services/bookService';
import { getAllIssuedBooks } from '../../services/issueService';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { SearchBar, LoadingSpinner, EmptyState, ConfirmDialog, StatCard } from '../../components/common/index.jsx';
import { exportUsersToExcel, exportBooksToExcel, exportIssuedBooksToExcel } from '../../utils/exportUtils';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const safeDate = (val) => {
  if (!val) return '—';
  try { return format(val?.toDate ? val.toDate() : new Date(val), 'MMM d, yyyy'); } catch { return '—'; }
};

// ─── Manage Users ─────────────────────────────────────────────────────────────
export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => { const u = await getAllUsers(); setUsers(u); setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleRoleChange = async (uid, role) => {
    try { await updateUserRole(uid, role); toast.success('Role updated'); load(); }
    catch { toast.error('Failed to update role'); }
  };

  const filtered = users.filter(u => {
    const term = search.toLowerCase();
    return !search || u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
  });

  return (
    <DashboardLayout>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">{users.length} registered users</p>
        </div>
        <button onClick={() => exportUsersToExcel(filtered)} className="btn-ghost border border-ink-200 text-sm">
          📤 Export Excel
        </button>
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search users..." className="mb-6 max-w-sm" />
      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Joined</th>
                  <th className="table-header">Change Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.uid} className="hover:bg-ink-50/50 transition-colors">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-amber-700">{(user.name || 'U').charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-medium text-ink-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="table-cell text-ink-600">{user.email}</td>
                    <td className="table-cell">
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-forest-100 text-forest-800')}>
                        {user.role}
                      </span>
                    </td>
                    <td className="table-cell text-ink-500">{safeDate(user.createdAt)}</td>
                    <td className="table-cell">
                      <select value={user.role} onChange={e => handleRoleChange(user.uid, e.target.value)}
                        className="text-xs border border-ink-200 rounded px-2 py-1 text-ink-700 focus:outline-none focus:ring-1 focus:ring-amber-400">
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [delId, setDelId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCats = async () => {
    const c = await getAllCategories();
    console.log('Categories fetched:', c); // Debug log
    console.log('Categories count:', c.length); // Debug log
    setCategories(c); 
    setLoading(false);
  };
  useEffect(() => { loadCats(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    try {
      await addCategory(newCat.trim());
      toast.success('Category added');
      setNewCat('');
      loadCats();
    } catch { toast.error('Failed to add category'); }
  };

  const handleDelete = async () => {
    try { await deleteCategory(delId); toast.success('Category deleted'); loadCats(); }
    catch { toast.error('Failed to delete category'); }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Book Categories</h1>
        <p className="page-subtitle">Manage library categories</p>
      </div>
      <div className="max-w-lg">
        <div className="card p-6 mb-6">
          <h2 className="section-title mb-4">Add New Category</h2>
          <form onSubmit={handleAdd} className="flex gap-3">
            <input type="text" value={newCat} onChange={e => setNewCat(e.target.value)}
              className="input-field flex-1" placeholder="Category name..." />
            <button type="submit" className="btn-secondary">Add</button>
          </form>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="card divide-y divide-ink-50">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-medium text-ink-800">{cat.categoryName || cat.name}</span>
                <button onClick={() => setDelId(cat.id)} className="text-xs text-crimson-600 hover:text-crimson-700 font-medium">Delete</button>
              </div>
            ))}
            {categories.length === 0 && <p className="px-5 py-8 text-sm text-ink-400 text-center">No categories yet</p>}
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={!!delId} onClose={() => setDelId(null)} onConfirm={handleDelete}
        title="Delete Category" message="Delete this category? Books in this category won't be affected." confirmText="Delete" />
    </DashboardLayout>
  );
};

// ─── Reports ──────────────────────────────────────────────────────────────────
export const Reports = () => {
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllBooks(), getAllIssuedBooks(), getAllUsers()]).then(([b, i, u]) => {
      setBooks(b); setIssues(i); setUsers(u); setLoading(false);
    });
  }, []);

  const totalAvailable = books.reduce((s, b) => s + (b.available || 0), 0);
  const totalIssued = issues.filter(i => i.status === 'issued').length;
  const overdue = issues.filter(i => i.status === 'issued' && i.returnDate && new Date(i.returnDate) < new Date()).length;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Library analytics and export tools</p>
      </div>
      {loading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              ['Total Books', books.length, 'border-amber-400'],
              ['Available Copies', totalAvailable, 'border-forest-400'],
              ['Currently Issued', totalIssued, 'border-ink-400'],
              ['Overdue', overdue, 'border-crimson-400'],
            ].map(([l, v, c]) => (
              <div key={l} className={"card p-5 border-l-4 " + c}>
                <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">{l}</p>
                <p className="font-display text-3xl font-bold text-ink-900">{v}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Book Inventory', desc: books.length + ' books', action: () => exportBooksToExcel(books), label: 'Export Books (.xlsx)' },
              { title: 'Issued Books Report', desc: issues.length + ' records', action: () => exportIssuedBooksToExcel(issues), label: 'Export Issues (.xlsx)' },
              { title: 'User Directory', desc: users.length + ' users', action: () => exportUsersToExcel(users), label: 'Export Users (.xlsx)' },
            ].map(r => (
              <div key={r.title} className="card p-6">
                <h3 className="font-display text-lg font-semibold text-ink-800 mb-1">{r.title}</h3>
                <p className="text-sm text-ink-500 mb-4">{r.desc}</p>
                <button onClick={r.action} className="btn-primary text-sm w-full">📤 {r.label}</button>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const Settings = () => (
  <DashboardLayout>
    <div className="page-header">
      <h1 className="page-title">System Settings</h1>
      <p className="page-subtitle">Configure library system preferences</p>
    </div>
    <div className="max-w-2xl space-y-6">
      {[
        { title: 'Borrowing Period', desc: 'Default borrow duration for students', value: '14 days' },
        { title: 'Max Books per Student', desc: 'Maximum concurrent borrows allowed', value: '3 books' },
        { title: 'Late Return Policy', desc: 'Fine per day for overdue books', value: '$0.50/day' },
        { title: 'Email Notifications', desc: 'Automated email reminders for due dates', value: 'Enabled' },
      ].map(s => (
        <div key={s.title} className="card p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-ink-900 text-sm">{s.title}</p>
            <p className="text-xs text-ink-500 mt-0.5">{s.desc}</p>
          </div>
          <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full flex-shrink-0">{s.value}</span>
        </div>
      ))}
      <div className="card p-6 bg-amber-50 border-amber-200">
        <p className="text-sm font-semibold text-amber-800 mb-2">Firebase Configuration</p>
        <p className="text-xs text-amber-700">
          Update your Firebase credentials in <code className="bg-amber-100 px-1 rounded font-mono">src/firebase/config.js</code>
        </p>
      </div>
    </div>
  </DashboardLayout>
);
