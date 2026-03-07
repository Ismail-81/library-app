// src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../firebase/auth';
import toast from 'react-hot-toast';
import Logo from '../Logo';

export const Navbar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-ink-950 text-amber-50 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-amber-200/70 hover:text-amber-100 transition-colors">Home</Link>
            <Link to="/browse" className="text-sm text-amber-200/70 hover:text-amber-100 transition-colors">Browse</Link>
            <Link to="/about" className="text-sm text-amber-200/70 hover:text-amber-100 transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-amber-200/70 hover:text-amber-100 transition-colors">Contact</Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={profile?.role === 'admin' ? '/admin' : '/student'}
                  className="text-sm text-amber-200/80 hover:text-amber-100 transition-colors"
                >
                  {profile?.name || user.email}
                </Link>
                <button onClick={handleLogout} className="text-sm px-3 py-1.5 rounded border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-ink-900 transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm text-amber-200/70 hover:text-amber-100 transition-colors">Login</Link>
                <Link to="/register" className="text-sm px-4 py-1.5 rounded bg-amber-400 text-ink-900 font-medium hover:bg-amber-300 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded text-amber-200" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-ink-800 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link to="/" className="px-3 py-2 text-sm text-amber-200/70 hover:text-amber-100" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/browse" className="px-3 py-2 text-sm text-amber-200/70 hover:text-amber-100" onClick={() => setMenuOpen(false)}>Browse</Link>
              <Link to="/about" className="px-3 py-2 text-sm text-amber-200/70 hover:text-amber-100" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/contact" className="px-3 py-2 text-sm text-amber-200/70 hover:text-amber-100" onClick={() => setMenuOpen(false)}>Contact</Link>
              {user ? (
                <button onClick={handleLogout} className="text-left px-3 py-2 text-sm text-crimson-400">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 text-sm text-amber-200/70" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="px-3 py-2 text-sm text-amber-300" onClick={() => setMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
