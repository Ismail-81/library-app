// src/pages/public/Home.jsx
import { Link } from 'react-router-dom';
import { Book, Search, ListTodo, BarChart3, Bell, Upload } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { useAuth } from '../../context/AuthContext';

export const Home = () => {
  const { user, profile } = useAuth();
  const dashboardPath = profile?.role === 'admin' ? '/admin' : '/student';

  return (
  <div className="min-h-screen bg-ink-50">
    <Navbar />

    {/* Hero */}
    <section className="relative bg-ink-950 overflow-hidden min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-paper opacity-20" />
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-amber-400/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-2xl animate-slide-up">
          <span className="inline-block text-xs font-semibold text-amber-400 tracking-widest uppercase mb-6 border border-amber-400/30 px-3 py-1 rounded-full">
            Library Management System
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-amber-50 leading-tight mb-6">
            Every great reader<br />
            <em className="text-amber-400 not-italic">begins here.</em>
          </h1>
          <p className="text-amber-100/60 text-lg mb-10 leading-relaxed">
            Discover thousands of books, manage your reading journey, and explore the world of knowledge at Bookentra — your digital library companion.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/browse" className="btn-secondary px-8 py-3 text-base">Browse Library</Link>
            {user ? (
              <Link to={dashboardPath} className="btn-ghost text-amber-100 border border-amber-100/20 px-8 py-3 text-base hover:bg-amber-100/10">
                Go to Dashboard →
              </Link>
            ) : (
              <Link to="/register" className="btn-ghost text-amber-100 border border-amber-100/20 px-8 py-3 text-base hover:bg-amber-100/10">
                Get Started →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-amber-400 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[['12,000+', 'Books Available'], ['3,400+', 'Active Students'], ['50+', 'Categories'], ['98%', 'Satisfaction Rate']].map(([v, l]) => (
          <div key={l} className="text-center">
            <p className="font-display text-3xl font-bold text-ink-900">{v}</p>
            <p className="text-sm text-ink-700 mt-1">{l}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl font-bold text-ink-900 mb-4">Everything you need</h2>
        <p className="text-ink-500 text-lg max-w-xl mx-auto">A complete library management experience — from browsing to borrowing.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { Icon: Book, title: 'Vast Collection', desc: 'Access thousands of books across fiction, science, history, technology, and more.' },
          { Icon: Search, title: 'Smart Search', desc: 'Find books instantly by title, author, or category with real-time search.' },
          { Icon: ListTodo, title: 'Easy Borrowing', desc: 'Issue and return books in seconds. Track due dates and get notifications.' },
          { Icon: BarChart3, title: 'Rich Dashboard', desc: 'Students and admins get personalized dashboards with all the stats they need.' },
          { Icon: Bell, title: 'Notifications', desc: 'Stay informed about due dates, new arrivals, and borrowing status.' },
          { Icon: Upload, title: 'Export Reports', desc: 'Admins can export book lists, user data and issued books to Excel or CSV.' },
        ].map(f => {
          const IconComponent = f.Icon;
          return (
          <div key={f.title} className="card p-6 hover:shadow-elevated transition-shadow duration-300">
            <div className="mb-4"><IconComponent className="w-8 h-8 text-amber-600" /></div>
            <h3 className="font-display text-lg font-semibold text-ink-900 mb-2">{f.title}</h3>
            <p className="text-sm text-ink-500 leading-relaxed">{f.desc}</p>
          </div>
          );
        })
        }
      </div>
    </section>

    {/* CTA */}
    <section className="bg-ink-900 py-20">
      <div className="max-w-3xl mx-auto text-center px-6">
        <h2 className="font-display text-4xl font-bold text-amber-100 mb-4">Start reading today</h2>
        {user ? (
          <>
            <p className="text-amber-100/60 mb-8">Welcome back! Head to your dashboard to continue your reading journey.</p>
            <Link to={dashboardPath} className="btn-secondary px-10 py-3 text-base">Go to Dashboard →</Link>
          </>
        ) : (
          <>
            <p className="text-amber-100/60 mb-8">Register for free and get instant access to our entire library collection.</p>
            <Link to="/register" className="btn-secondary px-10 py-3 text-base">Join Bookentra</Link>
          </>
        )}
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-ink-950 text-amber-100/40 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-lg font-bold text-amber-100/60">Bookentra</p>
        <p className="text-sm">© {new Date().getFullYear()} Bookentra Library Management System</p>
        <div className="flex gap-6 text-sm">
          <Link to="/about" className="hover:text-amber-100 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-amber-100 transition-colors">Contact</Link>
          <Link to="/browse" className="hover:text-amber-100 transition-colors">Browse</Link>
        </div>
      </div>
    </footer>
  </div>
  );
};
