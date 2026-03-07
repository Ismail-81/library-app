# 📚 Bookentra — Library Management System

A full-stack Library Management System built with **React (Vite)**, **Tailwind CSS**, and **Firebase** (Authentication + Firestore).

---

## ✨ Features

### Authentication
- Email/Password registration and login
- Email verification
- Role-based access: **Admin** and **Student**
- Protected routes with automatic role-based redirects

### Admin Features
- 📊 **Dashboard** — Stats: total books, users, issued books, available copies
- 📚 **Book Management** — Add, edit, delete books with full CRUD
- 👥 **User Management** — View all users, change roles
- 📋 **Issued Books Tracking** — Filter by status (issued/returned/overdue)
- 🏷 **Category Management** — Create and delete book categories
- 📤 **Export Reports** — Export books, users, and issued books to `.xlsx` or `.csv`
- ⚙ **Settings** — View system configuration

### Student Features
- 🏠 **Dashboard** — Currently borrowed books, stats, quick actions
- 🔍 **Browse Books** — Search by title/author/category with live filtering
- 📖 **Borrow Book** — Issue books with automatic 14-day due date
- ↩ **Return Book** — Return books from dashboard or book detail page
- 📜 **Borrow History** — Full history of all borrows
- 🔔 **Notifications** — Real-time notifications for issue/return events
- 👤 **Profile** — Update personal details

### General
- 🔍 Real-time search across all books
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Premium editorial design with Playfair Display + DM Sans typography
- ⚡ Fast Vite build pipeline

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password sign-in
4. Enable **Firestore Database** (start in test mode initially)
5. Register a web app and copy your config

Edit `src/firebase/config.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Set Firestore Security Rules

Copy the contents of `firestore.rules` into your Firebase Console under **Firestore → Rules**.

### 4. Run the dev server

```bash
npm run dev
```

### 5. Seed initial data (optional)

In Firebase Firestore, create a `categories` collection with documents containing `{ categoryName: "Fiction" }`, etc.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── books/
│   │   └── BookCard.jsx          # Reusable book card component
│   ├── common/
│   │   ├── index.jsx             # LoadingSpinner, Modal, SearchBar, etc.
│   │   └── ProtectedRoute.jsx    # Auth + role guard
│   └── layout/
│       ├── Navbar.jsx            # Public top navbar
│       └── DashboardLayout.jsx   # Sidebar + dashboard shell
├── context/
│   └── AuthContext.jsx           # Firebase auth state context
├── firebase/
│   ├── config.js                 # Firebase initialization
│   └── auth.js                   # Auth helper functions
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageBooks.jsx
│   │   ├── BookForms.jsx         # Add + Edit book
│   │   ├── IssuedBooks.jsx
│   │   └── AdminPages.jsx        # Users, Categories, Reports, Settings
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── public/
│   │   ├── Home.jsx
│   │   ├── BrowseBooks.jsx
│   │   ├── BookDetails.jsx
│   │   └── AboutContact.jsx
│   └── student/
│       ├── StudentDashboard.jsx
│       ├── StudentBooks.jsx
│       └── StudentPages.jsx      # Issued, History, Notifications, Profile
├── services/
│   ├── bookService.js            # Firestore CRUD for books & categories
│   ├── issueService.js           # Issue/return book logic
│   ├── notificationService.js    # Notifications CRUD
│   └── userService.js            # User management
└── utils/
    └── exportUtils.js            # Excel/CSV export helpers
```

---

## 🗄 Firestore Collections

| Collection | Fields |
|---|---|
| `users` | name, email, role, createdAt, isActive |
| `books` | title, author, category, description, quantity, available, isbn, createdAt |
| `issuedBooks` | userId, bookId, bookTitle, bookAuthor, userName, issueDate, returnDate, actualReturnDate, status |
| `categories` | categoryName, createdAt |
| `notifications` | userId, message, type, read, date |

---

## 🎨 Design System

- **Primary Font**: Playfair Display (serif, editorial)
- **Body Font**: DM Sans (clean, modern)
- **Color Palette**: 
  - `ink` — dark neutrals (primary UI)
  - `amber` — warm accent (CTAs, highlights)
  - `forest` — success/available states
  - `crimson` — error/danger/overdue states

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `firebase` | Auth + Firestore |
| `react-router-dom` | Client-side routing |
| `xlsx` | Excel file generation |
| `file-saver` | Browser file download |
| `react-hot-toast` | Toast notifications |
| `lucide-react` | Icon library |
| `date-fns` | Date formatting |

---

## 🔒 Security

- Protected routes enforce role-based access
- Firestore rules restrict data access by user role
- Admin actions (delete, role change) require admin role in both frontend and Firestore rules

---

## 📜 License

MIT — Free to use and modify.
