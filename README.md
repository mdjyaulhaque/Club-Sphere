# School Club Management Platform (ClubSphere)

A comprehensive web application designed to help students discover, join, and manage school clubs. The platform supports three distinct user roles—students, club leaders, and administrators—allowing role-based access to browse clubs, manage memberships, post announcements, and oversee the entire system.

---

## Table of Contents

- [Features](#features)  
- [User Roles](#user-roles)  
- [System Architecture](#system-architecture)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage)  
- [External Dependencies](#external-dependencies)  
- [Authentication & Security](#authentication--security)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  

---

## Features

- **Student Dashboard:** Browse clubs by interest, join/leave clubs, view announcements.  
- **Club Leader Dashboard:** Manage club members, post announcements, schedule meetings, and oversee club activities.  
- **Administrator Dashboard:** Full system access including user management, club oversight, and platform analytics.  
- **Role-based Access Control:** Secure access based on user type (student, leader, admin).  
- **Responsive UI:** Accessible on desktop and mobile with light/dark mode support.  
- **Search & Filter:** Easily search clubs based on interests or categories.  
- **Notifications:** Stay updated on announcements and events.  

---

## User Roles

| Role             | Permissions                                                                 |
|-----------------|----------------------------------------------------------------------------|
| **Student**      | Browse clubs, join/leave, view announcements                               |
| **Club Leader**  | All student permissions + create/manage clubs, manage members, post announcements |
| **Administrator**| Full access to all features, manage users, clubs, and platform settings    |

---

## System Architecture

**Frontend:**  
- Framework: React with TypeScript  
- Styling: Tailwind CSS + shadcn/ui  
- State Management: TanStack Query  
- Routing: Wouter  
- Forms & Validation: React Hook Form + Zod  
- Theme System: Light/dark mode using CSS variables  

**Backend:**  
- Framework: Express.js with TypeScript  
- Authentication: Passport.js (local strategy)  
- Password Security: Node.js crypto module (scrypt)  
- Session Management: Express sessions  
- API Design: RESTful endpoints with error handling and logging middleware  

**Database:**  
- ORM: Drizzle ORM  
- Database: PostgreSQL (Neon serverless for production)  
- Schema: Users, clubs, memberships, announcements  

**Development Storage:** In-memory storage for testing  

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui, Wouter, React Hook Form  
- **Backend:** Node.js, Express.js, TypeScript, Passport.js, scrypt  
- **Database:** PostgreSQL (Neon), Drizzle ORM  
- **State Management:** TanStack Query  
- **Validation:** Zod  
- **Build Tools:** Vite, ESBuild, PostCSS  

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/school-club-management.git
cd school-club-management

# Frontend
cd client
npm install

# Backend
cd ../server
npm install
Configure Environment Variables
Create a .env file in the server directory:

env
Copy code
DATABASE_URL=your_postgresql_url
SESSION_SECRET=your_session_secret
NODE_ENV=development
Usage
bash
Copy code
# Backend (development)
cd server
npm run dev

# Frontend (development)
cd client
npm run dev
Students: Browse clubs, join/leave, view announcements
Club Leaders: Create/manage clubs, post announcements, manage members
Administrators: Full access to manage users, clubs, and platform settings

External Dependencies
Database & Storage: Neon Database, Drizzle ORM, connect-pg-simple

UI & Design: Radix UI, Tailwind CSS, shadcn/ui, Lucide Icons

State & Forms: TanStack Query, React Hook Form, Zod

Auth & Security: Passport.js, Express Session, Node.js Crypto

Authentication & Security
Role-based access control for students, leaders, and admins

Session-based authentication

Secure password hashing using scrypt

Configurable session storage for production

Deployment (Render)
Follow these steps to deploy ClubSphere on Render:

Create a new Web Service

Go to Render → New → Web Service → Connect GitHub repository.

Build & Start Commands

Build Command:

bash
Copy code
npm install --include=dev && npm install && npm run build
Start Command:

bash
Copy code
npm start
Environment Variables
Go to the Environment tab in Render and add the following:

Key	Value
SESSION_SECRET	your_secret_string
NODE_ENV	production
DATABASE_URL	your_postgresql_url (optional for future DB)

Node Version

Render defaults to Node.js 22.16.0, which works fine for this project.

You can change it in the Environment → Node Version section if needed.

Deploy

Click Create Web Service. Render will clone, build, and deploy your project.

Logs will show the build and start process; once completed, your app will be live at the assigned URL.

Contributing
Fork the repository

Create a new branch for your feature (git checkout -b feature-name)

Commit your changes (git commit -m 'Add feature')

Push to the branch (git push origin feature-name)

Open a pull request.
