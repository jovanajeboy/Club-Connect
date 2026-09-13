# ClubConnect – AI-Powered College Club Recruitment Platform

ClubConnect is a cloud-based web application designed to help college students discover clubs that match their skills, interests, career goals, and extracurricular activities.

The platform provides personalized and explainable club recommendations for students while allowing club coordinators to manage their club information through a dedicated dashboard.

---

## 🚀 Live Application

**Deployed Application:**  
https://clubconnect-coral.vercel.app

---

## 📌 Problem Statement

College students often find it difficult to identify clubs that match their interests, skills, career goals, and available time. Club information may also be distributed across different platforms, making the recruitment process less convenient.

ClubConnect provides a centralized platform where students can create their profiles, explore clubs, receive personalized recommendations, and apply to suitable clubs.

Club coordinators can manage their club information using CRUD operations.

---

## 🎯 Objectives

- Provide a centralized platform for college club discovery.
- Allow students to create and manage their profiles.
- Recommend suitable clubs based on student information.
- Provide explainable reasons for club recommendations.
- Allow coordinators to create, view, update, and delete club information.
- Implement RESTful APIs for frontend-backend communication.
- Use a cloud-hosted database for application data.
- Deploy the application using cloud platforms.

---

## ✨ Features

### 👨‍🎓 Student Features

- Student registration and login
- Secure password authentication
- Student profile creation
- Add skills and interests
- Add career goals
- Add availability
- Add extracurricular activities
- Browse available clubs
- View detailed club information
- Personalized club recommendations
- Explainable recommendation scores
- Apply to clubs
- View applications

### 👨‍💼 Coordinator Features

- Coordinator registration and login
- Coordinator dashboard
- Create clubs
- View club information
- Edit club information
- Delete clubs
- Manage recruitment status
- Set application deadlines
- Upload club logos

---

## 🤖 Explainable Recommendation System

ClubConnect uses an **Explainable Hybrid Recommendation Engine** based on weighted multi-factor matching.

The recommendation score considers:

| Factor | Weight |
|---|---:|
| Skills | 30% |
| Interests | 30% |
| Career Goals | 25% |
| Activities | 15% |

The system compares information from the student's profile with the requirements and characteristics of each club.

Instead of providing only a recommendation score, ClubConnect also provides understandable reasons explaining why a club is a good match.

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- RESTful APIs

### Database

- MongoDB Atlas
- Mongoose

### Authentication & Security

- JSON Web Tokens (JWT)
- bcryptjs

### File Uploads

- Multer

### Cloud Deployment

- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Cloud Database

### Source Code Management

- Git
- GitHub

---

## 🏗️ System Architecture

```text
                    ┌──────────────────┐
                    │       USER       │
                    │                  │
                    │ Student /        │
                    │ Coordinator      │
                    └────────┬─────────┘
                             │
                           HTTPS
                             │
                             ▼
                  ┌──────────────────────┐
                  │       VERCEL         │
                  │                      │
                  │ React + Vite         │
                  │ Frontend             │
                  └──────────┬───────────┘
                             │
                         REST API
                           HTTPS
                             │
                             ▼
                  ┌──────────────────────┐
                  │       RENDER         │
                  │                      │
                  │ Node.js + Express.js │
                  │ Backend REST API     │
                  │ JWT Authentication   │
                  └──────────┬───────────┘
                             │
                      Mongoose
                             │
                             ▼
                  ┌──────────────────────┐
                  │    MONGODB ATLAS     │
                  │                      │
                  │   Cloud Database     │
                  │                      │
                  │   Users Collection   │
                  │   Clubs Collection   │
                  └──────────────────────┘
```
##Clone the repository
git clone https://github.com/jovanajeboy/Club-Connect
cd club-recruitment-platform

##Install dependencies
npm install

###Configure environment variables
Create a .env file in the project root:
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET

Create a .env.local file:
VITE_API_URL=http://localhost:5000

###Start the backend
Open a terminal in VS Code and run: node backend/server.js

##Start the frontend
Open another terminal in VS Code and run: npm run dev
