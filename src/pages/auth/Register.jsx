// src/pages/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../firebase/auth';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

export const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      console.log('[Register] Creating account with role:', form.role);
      await registerUser({ name: form.name, email: form.email, password: form.password, role: form.role });
      toast.success(`Account created as ${form.role}! Please check your email for verification.`);
      navigate('/login');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'This email is already registered.'
        : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Logo
            iconClassName="bg-ink-900"
            svgClassName="text-amber-400"
            textClassName="text-ink-900"
            className="mb-6"
          />
          <h1 className="font-display text-3xl font-bold text-ink-900 mb-2">Create Account</h1>
          <p className="text-ink-500 text-sm">Join the library community</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field">
                <option value="student">Student</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Re-enter password" className="input-field" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-amber-100/30 border-t-amber-100 rounded-full animate-spin" />Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
