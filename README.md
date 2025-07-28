# Fields and Waves Visualization Lab

The Fields and Waves Visualization Lab is a web-based platform designed to provide an interactive and dynamic environment for students to experiment with and visualize complex electromagnetic concepts. The project bridges the gap between theoretical knowledge and practical applications using modern web technologies and interactive simulations.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Key Features](#key-features)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Major Modules & Visualizations](#major-modules--visualizations)
- [User Management & Authentication](#user-management--authentication)
- [Quiz & Progress Tracking](#quiz--progress-tracking)
- [Deployment & DevOps](#deployment--devops)
- [Contributors](#contributors)
- [How to Get Started](#how-to-get-started)
- [Extending the Project](#extending-the-project)

---

## Project Structure

The project is divided into two main parts:

- **Frontend:** Located in `frontend/` folder.
- **Backend:** Located in `backend/` folder.

---

## Technologies Used

**Frontend:**

- React
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Three.js, @react-three/fiber, @react-three/drei
- Recharts
- MathJax / KaTeX

**Backend:**

- Node.js
- Express
- MongoDB (Mongoose)
- JWT
- Nodemailer
- Cloudinary
- Multer
- Google OAuth

**Design:**

- Canva

**Deployment:**

- Vercel (frontend)
- Render (backend)
- MongoDB Atlas (database)

---

## Key Features

- **Interactive 3D Visualizations:** Vector algebra, calculus, electrostatics, Maxwell’s equations.
- **Quizzes & Assessments:** MCQ & fill-in-the-blank with feedback & explanations.
- **User Authentication:** Email/password, Google OAuth, JWT sessions.
- **User Dashboard:** Progress tracking, analytics, quiz history.
- **Content Navigation:** Sidebar, module/topic pages.
- **Responsive Design:** Works on all screen sizes.
- **Admin Tools:** Add/edit quizzes and content (if enabled).
- **Feedback & Support:** Contact form and contributor details.

---

## Frontend Overview

**Entry Point:**

- `frontend/src/App.tsx`: Sets up routes and layout.

**Routing:** (React Router v6)

- `/`: Home
- `/login`, `/signup`, `/profilepage`, `/userdashboard`
- `/module/:moduleSlug`: Module overview
- `/quiz/:moduleName/:chapterName`: Chapter quiz
- `/vector-addition`, `/electrostatics-intro`, etc.: Visualization pages

**Navigation:**

- `Navbar.tsx`, `Sidebar.tsx`

**Visualizations:**

- Components for each concept using Three.js or p5.js

**State Management:**

- Redux Toolkit for auth and user state

**Dashboard:**

- `UserDashboard.tsx`: Shows performance, stats, and quiz history

**Profile Page:**

- Manage user info, feedback, and quizzes (admin)

**Quiz System:**

- `ChapterQuiz` and related components

---

## Backend Overview

**Entry Point:**

- `backend/app.js`: Sets up Express, MongoDB, routes

**Authentication:**

- JWT-based
- Email/password with OTP, Google OAuth
- Password reset via email

**Models:**

- **User Model:** Name, email, password (hashed), picture, admin status
- **Quiz Model:** Questions, options, answers, points
- **Quiz Result Model:** User attempts, scores, timestamps

**API Routes:**

- Users, quizzes, quiz results, feedback, password reset

**Email Service:**

- Nodemailer for OTP and reset

**File Uploads:**

- Multer + Cloudinary

**Security:**

- CORS, env vars, error handling middleware

---

## Major Modules & Visualizations

- **Vector Algebra:** Add, subtract, dot/cross product, triple product
- **Vector Calculus:** Gradient, divergence, curl, coordinate systems
- **Electrostatics:** Coulomb’s law, field, potential, dipole, Gauss law
- **Maxwell’s Equations:** Magnetism, Faraday’s law, Ampere’s law, EMF

> Each topic includes interactive 2D/3D visualizations with controls.

---

## User Management & Authentication

- **Signup:** Email + OTP, or Google OAuth
- **Login:** JWT-based
- **Password Reset:** Via email
- **Profile:** View/edit info, quiz stats
- **Admin:** Manage quizzes/content

---

## Quiz & Progress Tracking

- **Quiz System:** Per chapter, with instant feedback
- **Dashboard:** Total points, quiz accuracy, topic-wise progress
- **Review System:** Past quizzes, explanations, solutions

---

## Deployment & DevOps

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## Contributors

- **Kothamasu Mohith Ram Sai Karthik Phalgun:** Dev, backend, frontend, visualizations
- **Sriman Reddy Bommireddy:** Dev, backend, frontend
- **Eraveni Sai Likhith:** Content
- **Abdul Khadar:** Content

---

## How to Get Started

1. **Clone the repo:**

```bash
git clone <repo-url>
```

2. **Install dependencies:**

```bash
cd frontend && npm install
cd ../backend && npm install
```

3. **Set up environment variables:**

- `backend/.env`: MongoDB URI, JWT secret, email creds, etc.

4. **Run the servers:**

```bash
cd frontend && npm run dev
cd backend && npm run dev
```

5. **Access the app:**

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## Extending the Project

- **Add new modules/topics:**

  - Create components in `frontend/src/components/`
  - Add routes in `App.tsx`

- **Add quizzes:**

  - Update quiz model via backend or admin interface

- **Improve visualizations:**

  - Use Three.js(React Three Fiber) or any other tool

- **Enhance analytics:**

  - Add stats endpoints and frontend views

- **Improve UI/UX:**

  - Use Figma or Canva for prototypes and Tailwind CSS for design


---

## Notes for Future Contributors

- Read this documentation and browse the codebase before major changes
- Follow code style and commit guidelines
- Contact original contributors for architecture-related queries

---

Enjoy building and contributing to the Fields and Waves Visualization Lab!

