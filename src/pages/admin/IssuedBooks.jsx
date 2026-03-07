// src/pages/admin/IssuedBooks.jsx
import { useState, useEffect } from 'react';
import { getAllIssuedBooks } from '../../services/issueService';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { SearchBar, LoadingSpinner, EmptyState } from '../../components/common';
import { exportIssuedBooksToExcel } from '../../utils/exportUtils';
import { format } from 'date-fns';

export const IssuedBooks = () => {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllIssuedBooks().then(d => { setIssues(d); setLoading(false); });
  }, []);

  const now = new Date();
  const filtered = issues.filter(i => {
    const term = search.toLowerCase();
    const matchS = !search || i.bookTitle?.toLowerCase().includes(term) || i.userName?.toLowerCase().includes(term);
    const isOverdue = i.status === 'issued' && i.returnDate && new Date(i.returnDate) < now;
    const matchF = filter === 'all' || 
      (filter === 'issued' && i.status === 'issued' && !isOverdue) ||
      (filter === 'returned' && i.status === 'returned') ||
      (filter === 'overdue' && isOverdue);
    return matchS && matchF;
  });

  const safeDate = (val) => {
    if (!val) return '—';
    try { return format(val?.toDate ? val.toDate() : new Date(val), 'MMM d, yyyy'); } catch { return '—'; }
  };

  const getStatus = (issue) => {
    if (issue.status === 'returned') return <span className="badge-returned">Returned</span>;
    const isOverdue = issue.returnDate && new Date(issue.returnDate) < now;
    if (isOverdue) return <span className="badge-overdue">Overdue</span>;
    return <span className="badge-issued">Issued</span>;
  };

  return (
    <DashboardLayout>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Issued Books</h1>
          <p className="page-subtitle">{issues.length} total records</p>
        </div>
        <button onClick={() => exportIssuedBooksToExcel(filtered)} className="btn-ghost border border-ink-200 text-sm">
          📤 Export Excel
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by book or student..." className="flex-1" />
        <div className="flex gap-2">
          {['all', 'issued', 'overdue', 'returned'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-ink-900 text-amber-100' : 'bg-white border border-ink-200 text-ink-600 hover:bg-ink-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>}
          title="No records found"
          description="No issued books match your filters"
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Book Title</th>
                  <th className="table-header">Student</th>
                  <th className="table-header">Issue Date</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header">Return Date</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(issue => (
                  <tr key={issue.id} className="hover:bg-ink-50/50 transition-colors">
                    <td className="table-cell font-medium text-ink-900">{issue.bookTitle}</td>
                    <td className="table-cell text-ink-600">{issue.userName}</td>
                    <td className="table-cell text-ink-500">{safeDate(issue.issueDate)}</td>
                    <td className="table-cell text-ink-500">
                      {issue.returnDate ? format(new Date(issue.returnDate), 'MMM d, yyyy') : '—'}
                    </td>
                    <td className="table-cell text-ink-500">{safeDate(issue.actualReturnDate)}</td>
                    <td className="table-cell">{getStatus(issue)}</td>
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
