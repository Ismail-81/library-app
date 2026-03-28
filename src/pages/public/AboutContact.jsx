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
          {[{icon: 'Mail', label: 'Email', value: 'faizhira632@gmail.com'}, {icon: 'Phone', label: 'Phone', value: '+1 (555) 000-0000'}, {icon: 'MapPin', label: 'Address', value: '123 Library Lane'}].map(item => {
            const icons = {Mail: <svg className="w-6 h-6 mx-auto text-ink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, Phone: <svg className="w-6 h-6 mx-auto text-ink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, MapPin: <svg className="w-6 h-6 mx-auto text-ink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>};
            return (
            <div key={item.label} className="card p-4">
              <div className="mb-2">{icons[item.icon]}</div>
              <p className="text-xs font-semibold text-ink-700">{item.label}</p>
              <p className="text-xs text-ink-500 mt-0.5">{item.value}</p>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
