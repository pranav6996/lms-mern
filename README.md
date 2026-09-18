# LearnHub LMS — Modern Full-Stack MERN Learning Management System

LearnHub is a comprehensive, production-ready Learning Management System (LMS) built using the **MERN** stack (MongoDB, Express.js, React 19, Node.js), featuring **Socket.IO** real-time messaging, Role-Based Access Control (Admin, Teacher, Student), multi-step course creation, curriculum management, timed quizzes, interactive progress tracking, and media uploads.

---

## 🚀 Features

### 👤 Role-Based Access Control (RBAC)
- **Admin**: Full platform oversight, user management (CRUD, status toggles, role changes), course approval/publishing, categories management, global enrollment auditing, and system-wide announcements.
- **Teacher**: Instructor analytics dashboard, multi-step course creation wizard, module & lesson curriculum builder, quiz assessment creator, student performance tracking, and direct student chat.
- **Student**: Course catalog with search & multi-filtering, interactive course player (video & rich text), timed quizzes with instant grading, personalized progress tracking, and instructor messaging.

### ⚡ Core Functionality
- **Authentication & Security**: Secure JWT authentication, bcrypt password hashing, HTTP-only cookie support, rate limiting, and Helmet security headers.
- **Course & Curriculum Builder**: Modules, lessons (video embeds, rich text documents, resources), and sequential lesson tracking.
- **Interactive Quizzes**: Multiple-choice & true/false questions, time limits, passing thresholds, instant calculation of score and results breakdown.
- **Real-Time Layer**: Socket.IO integration for live notifications and student-teacher chat.
- **File & Media Handling**: Multer middleware with local storage fallback and Cloudinary support.
- **Modern Responsive UI**: Built with React 19, Tailwind CSS v4, Lucide React icons, and Recharts analytics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v6, Tailwind CSS v4, Lucide React, Recharts, Axios, Socket.IO Client |
| **Backend** | Node.js, Express.js, Socket.IO, Mongoose, JWT, Bcrypt.js, Multer, Helmet, Cors, Express Validator |
| **Database** | MongoDB |
| **Styling** | Modern CSS Variables Design System + Tailwind CSS v4 |

---

## 📁 Project Structure

```
fsd_mern/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # AuthContext & SocketContext
│   │   ├── layouts/            # DashboardLayout & public layouts
│   │   ├── pages/
│   │   │   ├── admin/          # Admin management suite
│   │   │   ├── auth/           # Login, Register, Password reset
│   │   │   ├── courses/        # Public catalog & course detail
│   │   │   ├── landing/        # Home landing page
│   │   │   ├── student/        # Student dashboard, player & quizzes
│   │   │   └── teacher/        # Teacher dashboard & course builder
│   │   ├── routes/             # AppRouter & RoleRoute guards
│   │   ├── services/           # Axios API services
│   │   ├── index.css           # Global tokens & design system
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express.js Backend
│   ├── config/                 # DB, Cloudinary & Socket config
│   ├── controllers/            # 13 REST API controllers
│   ├── middleware/             # Auth, roleAuth, error handler, upload
│   ├── models/                 # 12 Mongoose data models
│   ├── routes/                 # 13 API route modules
│   ├── seed/                   # Database seeder with demo accounts
│   ├── uploads/                # Local uploads storage
│   ├── app.js                  # Express application setup
│   ├── server.js               # HTTP & Socket.IO server entry
│   └── package.json
├── package.json                # Root concurrently scripts
├── .gitignore
└── README.md
```

---

## 🔑 Demo Credentials

All pre-seeded demo accounts share the password: `Password123!`

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `Password123!` |
| **Teacher** | `teacher@example.com` | `Password123!` |
| **Teacher 2** | `teacher2@example.com` | `Password123!` |
| **Student** | `student@example.com` | `Password123!` |
| **Student 2** | `student2@example.com` | `Password123!` |

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js**: v18+
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` or a MongoDB Atlas connection string.

### 2. Installation
Install all root, server, and client dependencies:
```bash
npm run install:all
```

### 3. Environment Configuration
Create environment configuration files from the templates:

**Server (`server/.env`):**
```env
MONGO_URI=mongodb://localhost:27017/learnhub
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
PORT=5000
SEED_PASSWORD=Password123!
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Seed Demo Data
Populate the database with demo users, categories, courses, lessons, and quizzes:
```bash
npm run seed
```

### 5. Start Development Servers
Run backend and frontend simultaneously:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🧪 Production Build & Verification

To verify production bundle build with zero errors:
```bash
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
