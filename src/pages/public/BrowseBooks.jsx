// src/pages/public/BrowseBooks.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBooks, getAllCategories } from '../../services/bookService';
import { Navbar } from '../../components/layout/Navbar';
import { BookCard } from '../../components/books/BookCard';
import { SearchBar, LoadingSpinner, EmptyState } from '../../components/common';

export const BrowseBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllBooks(), getAllCategories()]).then(([b, c]) => {
      setBooks(b);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  const filtered = books.filter(b => {
    const term = search.toLowerCase();
    const matchSearch = !search ||
      b.title?.toLowerCase().includes(term) ||
      b.author?.toLowerCase().includes(term) ||
      b.category?.toLowerCase().includes(term);
    const matchCat = !selectedCat || b.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />

      <div className="bg-ink-900 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold text-amber-50 mb-4">Browse Our Library</h1>
          <p className="text-amber-100/60 mb-8">Discover your next great read from our collection</p>
          <div className="max-w-xl mx-auto">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by title, author, or category..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setSelectedCat('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedCat ? 'bg-ink-900 text-amber-100' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'}`}>
            All Books ({books.length})
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.categoryName || cat.name)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCat === (cat.categoryName || cat.name) ? 'bg-ink-900 text-amber-100' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'}`}>
              {cat.categoryName || cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading books..." /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            title="No books found"
            description="Try a different search term or category"
          />
        ) : (
          <>
            <p className="text-sm text-ink-500 mb-6">{filtered.length} book{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map(book => (
                <BookCard key={book.id} book={book} actions={
                  <Link to={`/books/${book.id}`} className="btn-primary text-xs py-2 px-3 flex-1 text-center">View Details</Link>
                } />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
