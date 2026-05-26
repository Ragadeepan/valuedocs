# ValueDocs — Secure Document Vault

> **Secure Your Important Documents In One Place**

A premium SaaS digital document vault platform for individuals and families to store, organize, and manage their vital documents securely.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| State | Zustand, TanStack Query |
| Auth | Firebase Authentication |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Storage | Cloudinary |
| Animations | Framer Motion, GSAP |
| Charts | Recharts |

---

## Features

- 🔐 **Authentication** — Google OAuth + Email/Password via Firebase
- 📁 **Document Management** — Upload, organize, preview, download, share
- 👨‍👩‍👧‍👦 **Family Profiles** — Separate document vaults per family member
- 🗂️ **8 Categories** — ID Proof, Banking, Medical, Education, Insurance, Property, Vehicle, Others
- 👁️ **Document Viewer** — Image preview + PDF viewer with zoom
- ⏰ **Expiry Alerts** — Smart reminders for expiring documents
- 📤 **WhatsApp Sharing** — One-click document sharing
- 🔍 **Global Search** — Full-text search across all documents
- 🌙 **Dark Mode** — Premium dark/light theme with smooth transitions
- 📊 **Analytics Dashboard** — Charts, statistics, activity timeline
- 📱 **PWA Ready** — Installable as a mobile app
- 🏎️ **Performance** — Skeleton loaders, lazy loading, code splitting

---

## Project Structure

```
ValueDocs/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── layouts/       # Layout components (Sidebar, Navbar)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── store/         # Zustand state stores
│   │   ├── utils/         # Utilities & constants
│   │   └── lib/           # Third-party configs (Firebase, Axios)
│   └── public/
│
└── backend/           # Node.js + Express API
    └── src/
        ├── config/        # DB, Cloudinary, Firebase Admin
        ├── controllers/   # Route handlers
        ├── middleware/     # Auth, upload, rate limiter
        ├── models/        # Mongoose schemas
        ├── routes/        # Express routes
        ├── services/      # Business logic services
        └── utils/         # API response helpers, logger
```

---

## Quick Start

### 1. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Fill in Firebase credentials in .env
npm install
npm run dev
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in MongoDB, Cloudinary, and Firebase Admin credentials
npm install
npm run dev
```

---

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
FRONTEND_URL=http://localhost:5173
```

---

## Setup Instructions

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password + Google
3. Get your web app config for the frontend `.env`
4. Generate a service account key for the backend `.env`

### MongoDB Atlas Setup
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Add your IP to the allowlist
3. Create a database user and copy the connection string

### Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Copy your Cloud Name, API Key, and API Secret to backend `.env`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/verify` | Verify Firebase token & create user |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/documents` | Get all documents |
| POST | `/api/documents/upload` | Upload new document |
| GET | `/api/documents/search` | Search documents |
| GET | `/api/documents/expiring` | Get expiring documents |
| PUT | `/api/documents/:id` | Update document metadata |
| PATCH | `/api/documents/:id/rename` | Rename document |
| DELETE | `/api/documents/:id` | Delete document |
| POST | `/api/documents/:id/share` | Generate share link |
| GET | `/api/family` | Get family members |
| POST | `/api/family` | Add family member |
| GET | `/api/family/:id/documents` | Get member's documents |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/activity` | Activity log |

---

Built with ❤️ — ValueDocs © 2025
