<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</div>

<br />

<div align="center">
  <h1 align="center">🏠 Rent & Flatmate Finder</h1>
  <p align="center">
    An AI-powered, real-time platform to seamlessly match tenants with room owners based on lifestyle compatibility.
    <br />
    <br />
    <a href="https://rent-flatmate-finder-ni45-six.vercel.app/"><strong>View Live Demo »</strong></a>
    ·
    <a href="https://github.com/pranavshar223/rent-flatmate-finder/issues">Report Bug</a>
    ·
    <a href="https://github.com/pranavshar223/rent-flatmate-finder/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#system-architecture">System Architecture</a></li>
    <li><a href="#folder-structure">Folder Structure</a></li>
    <li><a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#environment-variables">Environment Variables</a></li>
      </ul>
    </li>
    <li><a href="#api-overview">API Overview</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#future-enhancements">Future Enhancements</a></li>
    <li><a href="#author">Author</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

Finding the right flatmate or renting out a room can be a daunting task. **Rent & Flatmate Finder** solves this by leveraging AI to match tenants with room owners based on lifestyle choices, budget, and habits. Featuring real-time chat, role-based dashboards, and seamless authentication, this platform offers a modern, end-to-end housing solution.

## Key Features

- 🔐 **Secure Authentication:** Google OAuth and Magic Link login powered by Supabase, backed by custom JWT verification.
- 🎭 **Role-Based Dashboards:** Distinct and intuitive interfaces for **Room Owners** (to list and manage properties) and **Tenants** (to discover and connect).
- 🤖 **AI Compatibility Matcher:** Integrates the Groq API (LLM) to calculate a personalized compatibility score and breakdown between tenants and owners based on sleep habits, cleanliness, and budget.
- 💬 **Real-Time Chat:** Built-in instant messaging using WebSockets (Socket.io) allowing users to negotiate and connect seamlessly.
- 🖼️ **Cloud Image Storage:** Secure and fast image uploading for room listings using Cloudinary.
- 🔍 **Advanced Filtering:** Tenants can search and filter rooms based on location, budget, and specific amenities.
- 📧 **Automated Emails:** Sending personalized transactional emails like welcome messages and match notifications using Nodemailer/Brevo.

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, TypeScript, Vite, Tailwind CSS, React Router, Lucide React |
| **Backend** | Node.js, Express.js, Socket.io, Zod (Validation) |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Authentication** | Supabase (OAuth), Custom JWT, bcrypt |
| **AI & External APIs** | Groq API (Llama 3), Cloudinary, Nodemailer |
| **Deployment** | Vercel (Frontend), Render (Backend & PostgreSQL Database) |

## System Architecture

```mermaid
graph TD
    Client[Frontend: React + Vite] -->|HTTPS Requests| API[Backend: Express Node.js]
    Client -->|WebSockets| WSS[Socket.io Server]
    
    API -->|Read/Write| DB[(PostgreSQL Database)]
    API -->|OAuth / Sessions| Supabase[Supabase Auth]
    API -->|Image Uploads| Cloudinary[Cloudinary API]
    API -->|Prompt Analysis| Groq[Groq AI / LLM]
    
    WSS <-->|Real-time Messaging| API
```

## Folder Structure

```text
rent-flatmate-finder/
├── frontend/                 # React Frontend Application
│   ├── src/
│   │   ├── api/              # Axios configuration and API endpoints
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React Context (Auth, Socket)
│   │   ├── features/         # Feature-based modules (auth, chat, tenant, owner)
│   │   ├── lib/              # Utility functions
│   │   └── types/            # TypeScript interfaces
│   └── ...
└── backend/                  # Node.js/Express Backend Application
    ├── prisma/               # Database schema and migrations
    ├── src/
    │   ├── config/           # Environment variables and setups
    │   ├── middlewares/      # Zod validation, error handling, auth guards
    │   ├── modules/          # Domain modules (auth, room, chat, compatibility)
    │   ├── providers/        # External services (Cloudinary, Groq, Supabase)
    │   ├── repositories/     # Database access layer
    │   ├── shared/           # Common utilities and error classes
    │   └── server.js         # Entry point
    └── ...
```

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher)
* PostgreSQL installed locally or a cloud database instance
* Accounts on [Supabase](https://supabase.com/), [Cloudinary](https://cloudinary.com/), and [Groq](https://groq.com/) for API keys.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pranavshar223/rent-flatmate-finder.git
   cd rent-flatmate-finder
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   
   # Push Prisma schema to your database
   npx prisma db push
   
   # Start the development server
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

### Environment Variables

You will need to create a `.env` file in both the `backend/` and `frontend/` directories.

**`backend/.env`**
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/rent_flatmate"
JWT_SECRET="your_secure_jwt_secret"
JWT_EXPIRES_IN="7d"

SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_KEY="your_supabase_service_role_key"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

GROQ_API_KEY="your_groq_api_key"
```

**`frontend/.env`**
```env
VITE_API_URL="http://localhost:5000/api/v1"
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
```

## API Overview

The backend follows a RESTful architecture. Here are some of the core endpoints:

* **Auth:**
  * `POST /api/v1/auth/login` - Authenticate via Supabase token
  * `POST /api/v1/auth/register` - Complete registration with role selection
* **Rooms:**
  * `GET /api/v1/rooms` - Fetch all available rooms (with filters)
  * `POST /api/v1/rooms` - Create a new room listing (Owner only)
* **Chat:**
  * `GET /api/v1/chat/conversations` - Get user conversations
  * `GET /api/v1/chat/conversations/:id/messages` - Get messages for a chat
* **Compatibility:**
  * `POST /api/v1/compatibility/calculate` - Trigger AI calculation

## Deployment

The application is fully configured for cloud deployment.

* **Frontend:** Deployed on **Vercel**. Connect your GitHub repository, select `Vite` as the framework, set the Root Directory to `frontend`, and inject the `VITE_` environment variables.
* **Backend:** Deployed on **Render**. 
  * Connect your GitHub repo and select `Node`.
  * **Root Directory:** `backend`
  * **Build Command:** `npm install && npx prisma generate && npx prisma db push`
  * **Start Command:** `npm start`
  * Create a managed PostgreSQL database on Render and inject the `DATABASE_URL` into your Web Service environment variables.

## Future Enhancements

- [ ] **Payments Integration:** Integrate Razorpay or Stripe for booking advances and rent payments.
- [ ] **Video Calling:** In-app video tours for rooms via WebRTC.
- [ ] **Identity Verification:** KYC document upload and automated verification for enhanced security.
- [ ] **Map View:** Interactive map using Mapbox to visualize room locations.

## Author

**Pranav Sharma**
- GitHub: [@pranavshar223](https://github.com/pranavshar223)

