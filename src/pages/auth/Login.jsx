// src/pages/auth/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { loginUser } from '../../firebase/auth';
import { getUserProfile } from '../../firebase/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();

  // Redirect if already logged in - use useEffect to avoid render-time navigation
  useEffect(() => {
    if (user && profile?.role) {
      const destination = profile.role === 'admin' ? '/admin' : '/student';
      // Only navigate if not already on the destination
      if (location.pathname !== destination) {
        navigate(destination, { replace: true });
      }
    }
  }, [user, profile, navigate, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      console.log('[Login] Attempting login with email:', form.email);
      const firebaseUser = await loginUser(form);
      console.log('[Login] Firebase user authenticated:', firebaseUser.uid);
      
      const userProfile = await getUserProfile(firebaseUser.uid);
      console.log('[Login] Retrieved profile:', userProfile);
      console.log('[Login] User role:', userProfile?.role);
      
      if (!userProfile) {
        console.error('[Login] ERROR: User profile not found in Firestore!');
        toast.error('User profile not found. Please contact admin.');
        setLoading(false);
        return;
      }
      
      const role = userProfile.role || 'student';
      console.log('[Login] Final role assigned:', role);
      
      toast.success(`Welcome back, ${userProfile?.name || 'User'}! (${role})`);
      // AuthContext will trigger redirect via useEffect
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' ? 'Invalid email or password.'
        : err.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.'
        : err.message;
      console.error('[Login] Error:', err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-paper opacity-30" />
        <div className="relative z-10">
          <Logo className="text-amber-100" />
        </div>
        <div className="relative z-10">
          <blockquote className="font-display text-3xl font-bold text-amber-100 leading-tight mb-4">
            "A reader lives a thousand lives before he dies."
          </blockquote>
          <p className="text-amber-300/60 font-body">— George R.R. Martin</p>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['12,000+', 'Books'], ['3,400+', 'Students'], ['98%', 'Satisfaction']].map(([v, l]) => (
            <div key={l} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="font-display text-xl font-bold text-amber-300">{v}</p>
              <p className="text-xs text-amber-100/50 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden mb-8 text-center">
            <Logo iconClassName="bg-ink-900" svgClassName="text-amber-400" textClassName="text-ink-900" />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-ink-900 mb-2">Welcome back</h1>
            <p className="text-ink-500 text-sm">Sign in to your library account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2 py-3">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-amber-100/30 border-t-amber-100 rounded-full animate-spin" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-600 hover:text-amber-700 font-medium">Create one</Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-800 mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-amber-700 font-mono">
              <p>Admin: admin@library.com / admin123</p>
              <p>Student: student@library.com / student123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
