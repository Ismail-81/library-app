// src/pages/student/StudentBooks.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooks, getAllCategories } from '../../services/bookService';
import { issueBook, getActiveIssues } from '../../services/issueService';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { BookCard } from '../../components/books/BookCard';
import { SearchBar, LoadingSpinner, EmptyState } from '../../components/common/index.jsx';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const StudentBooks = () => {
  const { user, profile } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeIssueIds, setActiveIssueIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [issuingId, setIssuingId] = useState(null);

  const load = async () => {
    const [b, c, active] = await Promise.all([
      getAllBooks(), getAllCategories(), getActiveIssues(user.uid)
    ]);
    setBooks(b);
    setCategories(c);
    setActiveIssueIds(new Set(active.map(a => a.bookId)));
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const handleIssue = async (book) => {
    setIssuingId(book.id);
    try {
      await issueBook({ userId: user.uid, bookId: book.id, userName: profile?.name, bookTitle: book.title });
      toast.success('"' + book.title + '" borrowed! Due in 14 days.');
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIssuingId(null);
    }
  };

  const filtered = books.filter(b => {
    const term = search.toLowerCase();
    const matchS = !search || b.title?.toLowerCase().includes(term) || b.author?.toLowerCase().includes(term) || b.category?.toLowerCase().includes(term);
    const matchC = !selectedCat || b.category === selectedCat;
    return matchS && matchC;
  });

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Browse Books</h1>
        <p className="page-subtitle">Discover your next read</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search books..." className="flex-1" />
        <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} className="input-field sm:w-48">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.categoryName || c.name}>{c.categoryName || c.name}</option>)}
        </select>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setSelectedCat('')}
          className={"px-3 py-1 rounded-full text-xs font-medium transition-all " + (!selectedCat ? 'bg-ink-900 text-amber-100' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50')}>
          All ({books.length})
        </button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCat(cat.categoryName || cat.name)}
            className={"px-3 py-1 rounded-full text-xs font-medium transition-all " + (selectedCat === (cat.categoryName || cat.name) ? 'bg-ink-900 text-amber-100' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50')}>
            {cat.categoryName || cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          title="No books found"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(book => {
            const isIssued = activeIssueIds.has(book.id);
            const isIssuing = issuingId === book.id;
            return (
              <BookCard
                key={book.id}
                book={book}
                actions={
                  <div className="flex gap-2 w-full">
                    <Link to={"/books/" + book.id} className="btn-ghost text-xs py-2 px-3 border border-ink-200 flex-shrink-0">
                      View
                    </Link>
                    {isIssued ? (
                      <button disabled className="btn-ghost text-xs py-2 px-3 flex-1 opacity-50 cursor-not-allowed border border-ink-200">
                        Borrowed ✓
                      </button>
                    ) : (
                      <button
                        onClick={() => handleIssue(book)}
                        disabled={book.available <= 0 || isIssuing}
                        className="btn-secondary text-xs py-2 px-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        {isIssuing ? <div className="w-3 h-3 border border-ink-900/30 border-t-ink-900 rounded-full animate-spin" /> : null}
                        {book.available <= 0 ? 'Unavailable' : 'Borrow'}
                      </button>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};
