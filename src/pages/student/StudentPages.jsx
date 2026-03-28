// src/pages/student/StudentPages.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyIssuedBooks, returnBook } from '../../services/issueService';
import { getMyNotifications, markNotificationRead, markAllRead } from '../../services/notificationService';
import { updateUserProfile } from '../../services/userService';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, EmptyState, ConfirmDialog } from '../../components/common';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const safeDate = (val) => {
  if (!val) return '—';
  try { return format(val?.toDate ? val.toDate() : new Date(val), 'MMM d, yyyy'); } catch { return '—'; }
};

// ─── My Issued Books (currently active) ──────────────────────────────────────
export const MyIssuedBooks = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returnId, setReturnId] = useState(null);

  const load = async () => {
    const all = await getMyIssuedBooks(user.uid);
    setIssues(all.filter(i => i.status === 'issued'));
    setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const handleReturn = async () => {
    try {
      await returnBook(returnId);
      toast.success('Book returned successfully!');
      load();
    } catch (err) { toast.error(err.message); }
  };

  const now = new Date();

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Borrowed Books</h1>
        <p className="page-subtitle">Books you currently have checked out</p>
      </div>
      {loading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div> : (
        issues.length === 0 ? (
          <EmptyState
            icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            title="No books checked out"
            description="Browse the library to borrow a book"
            action={<Link to="/student/books" className="btn-primary">Browse Books</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {issues.map(issue => {
              const due = new Date(issue.returnDate);
              const isOverdue = due < now;
              const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
              return (
                <div key={issue.id} className={`card p-5 border-l-4 ${isOverdue ? 'border-crimson-400' : daysLeft <= 3 ? 'border-amber-400' : 'border-forest-400'}`}>
                  <h3 className="font-display font-semibold text-ink-900 mb-1">{issue.bookTitle}</h3>
                  <p className="text-xs text-ink-500 mb-4">by {issue.bookAuthor}</p>
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-500">Issued</span>
                      <span className="text-ink-700">{safeDate(issue.issueDate)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink-500">Due Date</span>
                      <span className={`font-semibold ${isOverdue ? 'text-crimson-600' : 'text-ink-700'}`}>
                        {safeDate(issue.returnDate)}
                      </span>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold mb-4 flex items-center gap-1 ${isOverdue ? 'text-crimson-600' : daysLeft <= 3 ? 'text-amber-600' : 'text-forest-600'}`}>
                    {isOverdue ? (
                      <><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>Overdue! Please return immediately</>
                      ) : (
                        <><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>{daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining</>
                      )
                    }
                  </div>
                  <button onClick={() => setReturnId(issue.id)} className="btn-danger text-xs w-full py-2">
                    Return Book
                  </button>
                </div>
              );
            })}
          </div>
        )
      )}
      <ConfirmDialog isOpen={!!returnId} onClose={() => setReturnId(null)} onConfirm={handleReturn}
        title="Return Book" message="Confirm you want to return this book?" confirmText="Return" />
    </DashboardLayout>
  );
};

// ─── Borrow History ───────────────────────────────────────────────────────────
export const BorrowHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) getMyIssuedBooks(user.uid).then(d => { setHistory(d); setLoading(false); });
  }, [user]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Borrow History</h1>
        <p className="page-subtitle">All your past and current borrows</p>
      </div>
      {loading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div> : (
        history.length === 0 ? (
          <EmptyState icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="No history yet" description="Start borrowing books to build your history" />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Book</th>
                    <th className="table-header">Issue Date</th>
                    <th className="table-header">Due Date</th>
                    <th className="table-header">Return Date</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id} className="hover:bg-ink-50/50">
                      <td className="table-cell">
                        <p className="font-medium text-ink-900">{h.bookTitle}</p>
                        <p className="text-xs text-ink-500">{h.bookAuthor}</p>
                      </td>
                      <td className="table-cell text-ink-500">{safeDate(h.issueDate)}</td>
                      <td className="table-cell text-ink-500">{h.returnDate ? format(new Date(h.returnDate), 'MMM d, yyyy') : '—'}</td>
                      <td className="table-cell text-ink-500">{safeDate(h.actualReturnDate)}</td>
                      <td className="table-cell">
                        {h.status === 'returned'
                          ? <span className="badge-returned">Returned</span>
                          : <span className="badge-issued">Issued</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </DashboardLayout>
  );
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const Notifications = () => {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const n = await getMyNotifications(user.uid);
    setNotifs(n); setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const handleMarkAll = async () => {
    await markAllRead(user.uid);
    load();
    toast.success('All notifications marked as read');
  };

  const handleMarkOne = async (id) => {
    await markNotificationRead(id);
    load();
  };

  return (
    <DashboardLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{notifs.filter(n => !n.read).length} unread</p>
        </div>
        {notifs.some(n => !n.read) && (
          <button onClick={handleMarkAll} className="btn-ghost text-sm">Mark all read</button>
        )}
      </div>
      {loading ? <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div> : (
        notifs.length === 0 ? (
          <EmptyState
            icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
            title="No notifications" description="You're all caught up!" />
        ) : (
          <div className="space-y-2">
            {notifs.map(n => (
              <div key={n.id} onClick={() => !n.read && handleMarkOne(n.id)}
                className={`card px-5 py-4 flex items-start gap-4 cursor-pointer transition-all ${!n.read ? 'border-amber-300 bg-amber-50' : 'opacity-70'}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-amber-500' : 'bg-ink-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? 'text-ink-900 font-medium' : 'text-ink-600'}`}>{n.message}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{safeDate(n.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </DashboardLayout>
  );
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const StudentProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ name: profile?.name || '', email: profile?.email || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(user.uid, { name: form.name });
      await refreshProfile();
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
      </div>
      <div className="max-w-lg">
        <div className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-700">{(profile?.name || 'U').charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-ink-900">{profile?.name}</p>
              <span className="badge-available">{profile?.role}</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
              <input type="email" value={profile?.email || ''} disabled className="input-field opacity-60" />
              <p className="text-xs text-ink-400 mt-1">Email cannot be changed</p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
