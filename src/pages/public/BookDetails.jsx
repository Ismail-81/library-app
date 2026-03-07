// src/pages/public/BookDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBook } from '../../services/bookService';
import { issueBook, isBookIssuedByUser, returnBook } from '../../services/issueService';
import { Navbar } from '../../components/layout/Navbar';
import { LoadingSpinner } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const BookDetails = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [issueRecord, setIssueRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const b = await getBook(id);
      setBook(b);
      if (user) {
        const rec = await isBookIssuedByUser(user.uid, id);
        setIssueRecord(rec);
      }
      setLoading(false);
    };
    load();
  }, [id, user]);

  const handleIssue = async () => {
    if (!user) return navigate('/login');
    setActionLoading(true);
    try {
      await issueBook({ userId: user.uid, bookId: id, userName: profile?.name, bookTitle: book.title });
      toast.success(`"${book.title}" issued successfully! Due in 14 days.`);
      const rec = await isBookIssuedByUser(user.uid, id);
      setIssueRecord(rec);
      const updated = await getBook(id);
      setBook(updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!issueRecord) return;
    setActionLoading(true);
    try {
      await returnBook(issueRecord.id);
      toast.success('Book returned successfully!');
      setIssueRecord(null);
      const updated = await getBook(id);
      setBook(updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!book) return <div className="min-h-screen flex items-center justify-center"><p>Book not found.</p></div>;

  const isAvailable = book.available > 0;
  const dueDate = issueRecord?.returnDate ? new Date(issueRecord.returnDate) : null;
  const isOverdue = dueDate && dueDate < new Date();

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 mb-8 transition-colors">
          ← Back to Browse
        </Link>

        <div className="card overflow-visible">
          <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-500" />
          <div className="p-8 md:p-10 grid md:grid-cols-3 gap-10">
            {/* Book Spine Visual */}
            <div className="md:col-span-1 flex justify-center md:justify-start">
              <div className="w-40 h-56 bg-gradient-to-br from-ink-700 to-ink-900 rounded-lg shadow-book flex flex-col items-center justify-center p-4 text-center relative">
                <div className="absolute left-0 inset-y-0 w-1.5 bg-amber-400 rounded-l-lg" />
                <p className="font-display text-sm font-bold text-amber-100 leading-tight mb-3">{book.title}</p>
                <p className="text-xs text-amber-300/60">{book.author}</p>
                <div className="absolute bottom-3 text-xs text-amber-400/40 font-mono">{book.category}</div>
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-2">
              <div className="mb-1">
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{book.category}</span>
              </div>
              <h1 className="font-display text-3xl font-bold text-ink-900 mb-2">{book.title}</h1>
              <p className="text-ink-500 text-lg mb-6">by {book.author}</p>

              {book.description && (
                <p className="text-ink-600 leading-relaxed mb-8 text-sm">{book.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-ink-50 rounded-xl p-4">
                  <p className="text-xs text-ink-500 mb-1">Total Copies</p>
                  <p className="font-display text-2xl font-bold text-ink-900">{book.quantity}</p>
                </div>
                <div className={`rounded-xl p-4 ${isAvailable ? 'bg-forest-50' : 'bg-crimson-50'}`}>
                  <p className="text-xs text-ink-500 mb-1">Available Now</p>
                  <p className={`font-display text-2xl font-bold ${isAvailable ? 'text-forest-700' : 'text-crimson-700'}`}>
                    {book.available}
                  </p>
                </div>
              </div>

              {/* Issue Record */}
              {issueRecord && (
                <div className={`p-4 rounded-xl mb-6 border ${isOverdue ? 'bg-crimson-50 border-crimson-200' : 'bg-amber-50 border-amber-200'}`}>
                  <p className={`text-sm font-semibold mb-1 ${isOverdue ? 'text-crimson-800' : 'text-amber-800'}`}>
                    {isOverdue ? '⚠ Overdue!' : '📚 Currently Borrowed'}
                  </p>
                  <p className="text-xs text-ink-600">
                    Due: {dueDate ? format(dueDate, 'MMMM d, yyyy') : 'N/A'}
                    {isOverdue && ' — Please return immediately'}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {issueRecord ? (
                  <button onClick={handleReturn} disabled={actionLoading} className="btn-danger flex items-center gap-2">
                    {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    Return Book
                  </button>
                ) : (
                  <button onClick={handleIssue} disabled={!isAvailable || actionLoading} className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {actionLoading ? <div className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" /> : null}
                    {isAvailable ? 'Borrow Book' : 'Not Available'}
                  </button>
                )}
                {!user && (
                  <Link to="/login" className="btn-primary">Login to Borrow</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
