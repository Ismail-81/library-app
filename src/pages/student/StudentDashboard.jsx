// src/pages/student/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, ListTodo, Clock, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMyIssuedBooks, getActiveIssues } from '../../services/issueService';
import { getMyNotifications } from '../../services/notificationService';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard, LoadingSpinner } from '../../components/common';
import { format, formatDistanceToNow } from 'date-fns';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, notifications: 0 });
  const [activeIssues, setActiveIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMyIssuedBooks(user.uid),
      getActiveIssues(user.uid),
      getMyNotifications(user.uid)
    ]).then(([all, active, notifs]) => {
      setStats({ total: all.length, active: active.length, notifications: notifs.filter(n => !n.read).length });
      setActiveIssues(active);
      setLoading(false);
    });
  }, [user]);

  const safeDate = (val) => {
    if (!val) return '—';
    try { return format(new Date(val), 'MMM d, yyyy'); } catch { return '—'; }
  };

  const now = new Date();

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {profile?.name?.split(' ')[0] || 'Reader'}!</h1>
        <p className="page-subtitle">Your reading dashboard</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          label="Total Borrowed" value={stats.total} color="amber"
        />
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>}
          label="Currently Reading" value={stats.active} color="forest"
        />
        <StatCard
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
          label="Notifications" value={stats.notifications} color="crimson"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Browse Books', path: '/student/books', Icon: Book },
          { label: 'My Books', path: '/student/issued', Icon: ListTodo },
          { label: 'History', path: '/student/history', Icon: Clock },
          { label: 'Notifications', path: '/student/notifications', Icon: Bell },
        ].map(a => {
          const IconComponent = a.Icon;
          return (
          <Link key={a.path} to={a.path}
            className="card p-5 text-center hover:shadow-elevated transition-shadow duration-300 group">
            <div className="flex justify-center mb-2"><IconComponent className="w-6 h-6 text-ink-600 group-hover:text-ink-900" /></div>
            <p className="text-sm font-semibold text-ink-700 group-hover:text-ink-900">{a.label}</p>
          </Link>
          );
        })
        }
      </div>

      {/* Active Borrows */}
      {activeIssues.length > 0 && (
        <div className="card">
          <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
            <h2 className="section-title">Currently Borrowed</h2>
            <Link to="/student/issued" className="text-xs text-amber-600 hover:text-amber-700 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-ink-50">
            {activeIssues.map(issue => {
              const due = new Date(issue.returnDate);
              const isOverdue = due < now;
              const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
              return (
                <div key={issue.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink-900 text-sm">{issue.bookTitle}</p>
                    <p className="text-xs text-ink-500 mt-0.5">by {issue.bookAuthor}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-ink-500">Due: {safeDate(issue.returnDate)}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${isOverdue ? 'text-crimson-600' : daysLeft <= 3 ? 'text-amber-600' : 'text-forest-600'}`}>
                      {isOverdue ? 'Overdue!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
