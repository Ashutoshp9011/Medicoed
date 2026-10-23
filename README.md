# MedicoEd
 
MedicoEd gives medical students an engaging, user-friendly way to learn. The current focus is the core platform. It includes authentication, role-based users, database integration, and the foundation for future learning features.
 
## Screenshots
 
<p align="center">
 <img width="638" height="436" alt="image" src="https://github.com/user-attachments/assets/c83b8a13-b6cf-40c8-98aa-09638ee1f09a" />
 <img width="881" height="582" alt="image" src="https://github.com/user-attachments/assets/9c980ab2-a7c7-44cd-9cc4-f40ea07f973b" />

 

</p>
## Table of Contents
 
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How Signup Works](#how-signup-works)
- [Data Model](#data-model)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)
## Features
 
**Implemented**
 
- User signup with email validation and duplicate-email checking
- Password hashing with bcryptjs
- Role-based users: `student`, `educator`, `admin`
- Active/inactive account status
- Welcome page after signup
- MongoDB integration via Mongoose
- REST API backend (Express + TypeScript)
- Responsive frontend
**In progress**
 
- Complete login API and frontend integration
- Session / token-based authentication
## Tech Stack
 
| Layer | Technologies |
|-------|--------------|
| Frontend | React, TypeScript, Vite, HTML, CSS, JavaScript |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB|
| Security | bcryptjs, CORS, environment variables |
 
## Project Structure
 
```
medicoed/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts      # MongoDB connection
│   │   │   └── server.ts        # Express server entry point
│   │   └── models/
│   │       └── user.ts          # Mongoose user model
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── login.html / login.css
│   │   ├── signup.html / signup.css
│   │   ├── welcome.html / welcome.css
│   │   ├── script.js
│   │   └── media/
│   ├── package.json
│   └── vite.config.ts
│
├── .github/
├── .gitignore
├── package.json
└── README.md
```
 
## How Sign-up Works
 
```
Sign-up page (name, email, password)
        ↓
Express backend
        ↓
Validate data → Check for existing email → Hash password
        ↓
Save user to MongoDB
        ↓
Welcome page
```
 
## Data Model
 
**User**
 
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | User's name |
| `email` | String | Unique, normalized email |
| `password` | String | Hashed password (bcryptjs) |
| `role` | String | `student` \| `educator` \| `admin` |
| `isActive` | Boolean | Account status |
| `createdAt` | Date | Account creation time |
| `updatedAt` | Date | Last update time |
 
## Getting Started
 
**Prerequisites**
 
- Node.js and npm
- MongoDB (running locally)
- Git
**Installation**
 
```bash
# 1. Install backend dependencies
cd backend
npm install
 
# 2. Configure environment variables (see below)
cp .env.example .env
 
# 3. Make sure MongoDB is running, then start the backend
npx tsx src/config/server.ts
```
 
The backend runs at http://localhost:3000.
 
In a new terminal, start the frontend:
 
```bash
cd frontend
npm install
npm run dev
```
 
Vite prints the local frontend URL in the terminal.
 
## Environment Variables
 
Create `backend/.env` using `backend/.env.example` as a reference. Never commit `.env`.
 
For local development, the app connects to:
 
```
mongodb://127.0.0.1:27017/ngoDatabase
```
 
## Roadmap
 
- [x] Frontend setup, signup/login / welcome pages and styling
- [x] Express backend and MongoDB connection
- [x] User model, password hashing, email validation, duplicate checks, roles
- [ ] Complete login API
- [ ] Connect login frontend to backend
- [ ] Authentication/session management
- [ ] Student, educator, and admin dashboards
- [ ] Medical learning modules
- [ ] Clinical case simulations
- [ ] Quizzes and assessments
- [ ] Learning progress tracking
## Vision
 
MedicoEd aims to become a complete medical education platform where students can learn concepts, practice through interactive clinical scenarios, complete assessments, and track their progress, with educator tools, admin management, and personalized learning.
 
## Security
 
- Passwords hashed with bcryptjs
- Email normalization and duplicate-account prevention
- Configuration via environment variables
- CORS configuration
Never commit database credentials or other secrets to the repository.
 
## Contributing
 
Contributions and suggestions are welcome. Fork the repo, create a feature branch, and open a pull request.
 
## License
 
This project is currently developed for educational and development purposes.
