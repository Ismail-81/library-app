// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooks } from '../../services/bookService';
import { getAllIssuedBooks, getAllActiveIssues } from '../../services/issueService';
import { getAllUsers } from '../../services/userService';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard, LoadingSpinner } from '../../components/common';
import { format } from 'date-fns';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ books: 0, users: 0, issued: 0, available: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [books, users, issued, active] = await Promise.all([
        getAllBooks(), getAllUsers(), getAllIssuedBooks(), getAllActiveIssues()
      ]);
      const totalAvailable = books.reduce((sum, b) => sum + (b.available || 0), 0);
      setStats({ books: books.length, users: users.length, issued: active.length, available: totalAvailable });
      setRecentIssues(issued.slice(0, 8));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading dashboard..." /></div></DashboardLayout>;

  const statusBadge = (status) => {
    if (status === 'issued') return <span className="badge-issued">Issued</span>;
    if (status === 'returned') return <span className="badge-returned">Returned</span>;
    return <span className="badge-overdue">Overdue</span>;
  };

  const safeDate = (val) => {
    if (!val) return '—';
    try { return format(val?.toDate ? val.toDate() : new Date(val), 'MMM d, yyyy'); } catch { return '—'; }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of your library system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          label="Total Books" value={stats.books} color="amber" trend="In collection"
        />
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          label="Total Users" value={stats.users} color="ink" trend="Registered accounts"
        />
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          label="Currently Issued" value={stats.issued} color="crimson" trend="Active borrows"
        />
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          label="Available Copies" value={stats.available} color="forest" trend="Ready to borrow"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Add Book', path: '/admin/books/add', color: 'bg-amber-400 text-ink-900 hover:bg-amber-500' },
          { label: 'Manage Books', path: '/admin/books', color: 'bg-ink-900 text-amber-100 hover:bg-ink-800' },
          { label: 'View Users', path: '/admin/users', color: 'bg-forest-600 text-white hover:bg-forest-700' },
          { label: 'Reports', path: '/admin/reports', color: 'bg-ink-200 text-ink-900 hover:bg-ink-300' },
        ].map(a => (
          <Link key={a.path} to={a.path} className={`rounded-xl px-4 py-4 text-center text-sm font-semibold transition-all ${a.color}`}>
            {a.label}
          </Link>
        ))}
      </div>

      {/* Recent Issues Table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="section-title">Recent Issued Books</h2>
          <Link to="/admin/issued" className="text-xs text-amber-600 hover:text-amber-700 font-medium">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Book</th>
                <th className="table-header">Student</th>
                <th className="table-header">Issue Date</th>
                <th className="table-header">Due Date</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentIssues.map(issue => (
                <tr key={issue.id} className="hover:bg-ink-50/50 transition-colors">
                  <td className="table-cell font-medium text-ink-900">{issue.bookTitle}</td>
                  <td className="table-cell">{issue.userName}</td>
                  <td className="table-cell">{safeDate(issue.issueDate)}</td>
                  <td className="table-cell">{issue.returnDate ? format(new Date(issue.returnDate), 'MMM d, yyyy') : '—'}</td>
                  <td className="table-cell">{statusBadge(issue.status)}</td>
                </tr>
              ))}
              {recentIssues.length === 0 && (
                <tr><td colSpan={5} className="table-cell text-center text-ink-400 py-8">No issued books yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
