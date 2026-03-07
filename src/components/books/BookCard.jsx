// src/components/books/BookCard.jsx
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Fiction: 'bg-amber-100 text-amber-800',
  Science: 'bg-forest-100 text-forest-800',
  History: 'bg-ink-100 text-ink-800',
  Technology: 'bg-blue-100 text-blue-800',
  Mathematics: 'bg-purple-100 text-purple-800',
  Literature: 'bg-pink-100 text-pink-800',
  default: 'bg-ink-100 text-ink-700',
};

export const BookCard = ({ book, actions }) => {
  const catColor = CATEGORY_COLORS[book.category] || CATEGORY_COLORS.default;
  const isAvailable = book.available > 0;

  return (
    <div className="card group hover:shadow-elevated transition-all duration-300 animate-fade-in flex flex-col">
      {/* Book Spine Visual */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <Link to={`/books/${book.id}`} className="font-display text-base font-semibold text-ink-900 hover:text-amber-700 transition-colors line-clamp-2 block">
              {book.title}
            </Link>
            <p className="text-sm text-ink-500 mt-0.5">{book.author}</p>
          </div>
          <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${catColor}`}>
            {book.category}
          </span>
        </div>

        {book.description && (
          <p className="text-xs text-ink-500 line-clamp-2 mb-4 flex-1">{book.description}</p>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-forest-500' : 'bg-crimson-500'}`} />
              <span className={`text-xs font-medium ${isAvailable ? 'text-forest-700' : 'text-crimson-700'}`}>
                {isAvailable ? `${book.available} available` : 'Not available'}
              </span>
            </div>
            <span className="text-xs text-ink-400">{book.quantity} total</span>
          </div>

          {/* Availability Bar */}
          <div className="w-full bg-ink-100 rounded-full h-1.5 mb-4">
            <div
              className={`h-1.5 rounded-full transition-all ${isAvailable ? 'bg-forest-400' : 'bg-crimson-400'}`}
              style={{ width: `${book.quantity ? (book.available / book.quantity) * 100 : 0}%` }}
            />
          </div>

          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
};
