// src/pages/public/About.jsx
import { Navbar } from '../../components/layout/Navbar';

export const About = () => (
  <div className="min-h-screen bg-ink-50">
    <Navbar />
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-ink-900 mb-4">About Bookentra</h1>
        <p className="text-ink-500 text-lg">A modern library management system built for the digital age.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card p-8">
          <h2 className="font-display text-xl font-semibold text-ink-800 mb-4">Our Mission</h2>
          <p className="text-ink-600 text-sm leading-relaxed">
            Bookentra was created to bridge the gap between traditional library management and modern digital expectations.
            We believe every student deserves seamless access to knowledge, and every librarian deserves powerful tools to manage collections efficiently.
          </p>
        </div>
        <div className="card p-8">
          <h2 className="font-display text-xl font-semibold text-ink-800 mb-4">Our Vision</h2>
          <p className="text-ink-600 text-sm leading-relaxed">
            We envision a world where access to knowledge has no barriers. Bookentra provides a unified platform
            where books, readers, and administrators come together in a seamless, intelligent ecosystem.
          </p>
        </div>
      </div>
      <div className="mt-8 card p-8">
        <h2 className="font-display text-xl font-semibold text-ink-800 mb-6">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['React + Vite', 'Firebase Auth', 'Firestore', 'Tailwind CSS'].map(t => (
            <div key={t} className="bg-ink-50 rounded-xl p-4 text-center border border-ink-100">
              <p className="text-sm font-semibold text-ink-700">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// src/pages/public/Contact.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-ink-900 mb-4">Contact Us</h1>
          <p className="text-ink-500">Have a question or suggestion? We'd love to hear from you.</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                className="input-field min-h-[120px] resize-none" placeholder="How can we help?" required />
            </div>
            <button type="submit" className="btn-primary w-full py-3">Send Message</button>
          </form>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[['📧', 'Email', 'admin@bookentra.com'], ['📞', 'Phone', '+1 (555) 000-0000'], ['📍', 'Address', '123 Library Lane']].map(([e, l, v]) => (
            <div key={l} className="card p-4">
              <div className="text-2xl mb-2">{e}</div>
              <p className="text-xs font-semibold text-ink-700">{l}</p>
              <p className="text-xs text-ink-500 mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
