// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { Home } from './pages/public/Home';
import { BrowseBooks } from './pages/public/BrowseBooks';
import { BookDetails } from './pages/public/BookDetails';
import { About, Contact } from './pages/public/AboutContact';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageBooks } from './pages/admin/ManageBooks';
import { AddBook, EditBook } from './pages/admin/BookForms';
import { IssuedBooks } from './pages/admin/IssuedBooks';
import { ManageUsers, ManageCategories, Reports, Settings } from './pages/admin/AdminPages';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentBooks } from './pages/student/StudentBooks';
import { MyIssuedBooks, BorrowHistory, Notifications, StudentProfile } from './pages/student/StudentPages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              borderRadius: '10px',
              boxShadow: '0 4px 24px rgba(26,24,21,0.12)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseBooks />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/books" element={<ProtectedRoute requiredRole="admin"><ManageBooks /></ProtectedRoute>} />
          <Route path="/admin/books/add" element={<ProtectedRoute requiredRole="admin"><AddBook /></ProtectedRoute>} />
          <Route path="/admin/books/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditBook /></ProtectedRoute>} />
          <Route path="/admin/issued" element={<ProtectedRoute requiredRole="admin"><IssuedBooks /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute requiredRole="admin"><ManageCategories /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><Reports /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/books" element={<ProtectedRoute requiredRole="student"><StudentBooks /></ProtectedRoute>} />
          <Route path="/student/issued" element={<ProtectedRoute requiredRole="student"><MyIssuedBooks /></ProtectedRoute>} />
          <Route path="/student/history" element={<ProtectedRoute requiredRole="student"><BorrowHistory /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute requiredRole="student"><Notifications /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute requiredRole="student"><StudentProfile /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
