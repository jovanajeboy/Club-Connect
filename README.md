# ClubConnect – AI-Powered College Club Recruitment Platform

ClubConnect is a cloud-based web application that helps college students discover clubs that match their skills, interests, career goals, and extracurricular activities.

The platform provides personalized and explainable club recommendations while allowing club coordinators to manage club information through a dedicated dashboard.

## 🚀 Live Application

**Deployed Frontend:** [https://clubconnect-coral.vercel.app](https://clubconnect-coral.vercel.app)

- **Frontend hosting:** Vercel
- **Backend hosting:** Render
- **Database:** MongoDB Atlas

## 📌 Problem Statement

College students often find it difficult to identify clubs that match their interests, skills, career goals, and availability. Club information may also be distributed across different platforms, making the recruitment process less convenient.

ClubConnect provides a centralized platform where students can create profiles, explore clubs, receive personalized recommendations, and apply to suitable clubs. Club coordinators can manage club information through role-restricted CRUD operations.

## 🎯 Objectives

- Provide a centralized platform for college club discovery.
- Allow students to create and manage their profiles.
- Recommend suitable clubs based on student information.
- Explain why clubs are recommended.
- Allow coordinators to manage club information.
- Implement RESTful APIs for frontend-backend communication.
- Store application data in a cloud-hosted database.
- Deploy the application using cloud platforms.
- Demonstrate container-based load balancing and failure handling.
- Improve application security through authentication, MFA, and Docker hardening.

## ✨ Features

### 👨‍🎓 Student Features

- Student registration and login
- Secure password authentication
- Student profile creation and updates
- Skills, interests, career goals, and extracurricular activities
- Club browsing and detailed club information
- Personalized club recommendations
- Explainable recommendation scores
- Club applications and application viewing

### 👨‍💼 Coordinator Features

- Coordinator registration and login
- Coordinator dashboard
- Create, view, update, and delete club information
- Recruitment status management
- Application deadlines
- Club logo uploads
- Ownership and role checks for protected operations

## 🤖 Explainable Recommendation System

ClubConnect uses an **Explainable Hybrid Recommendation Engine** based on weighted multi-factor matching.

| Matching factor | Weight |
|---|---:|
| Skills | 30% |
| Interests | 30% |
| Career goals | 25% |
| Activities | 15% |
| **Total** | **100%** |

The system compares information from student profiles with club characteristics to calculate recommendation scores. It also provides understandable reasons for recommending a club.

## 🛠️ Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS and Tailwind CSS

### Backend
- Node.js
- Express.js
- RESTful APIs
- Mongoose

### Database
- MongoDB Atlas
- MongoDB collections for users and clubs

### Authentication and Security
- JSON Web Tokens (JWT)
- bcryptjs password hashing
- Time-based one-time password (TOTP) multi-factor authentication
- Authenticator app integration
- Authentication middleware
- Role-based authorization
- Profile ownership checks

### File Uploads
- Multer

### Deployment and Infrastructure
- Vercel — frontend hosting
- Render — deployed backend
- MongoDB Atlas — cloud database
- Docker — containerized backend instances
- Docker Compose — multi-container orchestration
- Nginx — reverse proxy and load balancing

### Security Scanning
- Trivy — Docker image vulnerability scanning
- Alpine-based Node.js image
- Non-root container user

## 🏗️ System Architecture

### Deployed application

```text
                ┌──────────────────────┐
                │   Students /         │
                │   Coordinators       │
                └──────────┬───────────┘
                           │
                          HTTPS
                           │
                           ▼
                ┌──────────────────────┐
                │        Vercel        │
                │   React + Vite UI    │
                └──────────┬───────────┘
                           │
                        REST API
                           │
                           ▼
                ┌──────────────────────┐
                │        Render        │
                │   Node.js + Express  │
                └──────────┬───────────┘
                           │
                        Mongoose
                           │
                           ▼
                ┌──────────────────────┐
                │    MongoDB Atlas     │
                │  Users and Clubs     │
                └──────────────────────┘
```

### Docker load-balancing test environment

```text
                ┌──────────────────────┐
                │    Load Test Client  │
                └──────────┬───────────┘
                           │
                    localhost:8080
                           │
                           ▼
                ┌──────────────────────┐
                │   Nginx Load         │
                │   Balancer            │
                └──────────┬───────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Backend 1│ │ Backend 2│ │ Backend 3│
        │ Docker   │ │ Docker   │ │ Docker   │
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │            │            │
             └────────────┼────────────┘
                          │
                          ▼
                ┌──────────────────────┐
                │    MongoDB Atlas     │
                │    Cloud Database    │
                └──────────────────────┘
```

The Docker load-balancing environment is used to test request distribution and backend failure handling. It is separate from the deployed Vercel and Render application.

## ⚖️ Load Balancing and Performance Testing

Three backend instances are run using Docker Compose behind an Nginx reverse proxy.

The Nginx configuration distributes API requests across the backend instances and includes retry handling for selected upstream failures.

### Load-test results

The following results were recorded using `autocannon` with 1,000 requests and concurrency of 20.

| Metric | One backend | Three backends |
|---|---:|---:|
| Requests attempted | 1,000 | 1,000 |
| Throughput | 46.67 req/s | 71.43 req/s |
| Average latency | 204.03 ms | 241.48 ms |
| p99 latency | 1,018 ms | 2,892 ms |
| Timeouts reported | 20 | Not confirmed in the recorded summary |

The three-backend test achieved approximately **53.1% higher throughput** than the one-backend test. However, its average and p99 latency were also higher, so increased throughput did not translate into lower latency.

### Failure handling

Backend failure handling was tested by stopping one backend container while sending requests through Nginx.

- Before stopping a backend, requests reached all three backend instances.
- After stopping one backend, all 20 requests in the recorded test returned HTTP 200 through the remaining two instances.
- Nginx upstream retry settings were configured and tested.

These results demonstrate the tested configuration's ability to continue serving requests during the tested single-backend failure scenario.

## 🔐 Security Implementation

### Password protection
Passwords are hashed using bcryptjs before storage. Login verifies the submitted password against the stored hash instead of storing or comparing plaintext passwords.

### Multi-factor authentication
TOTP-based MFA is integrated with authenticator apps. When MFA is enabled, login requires a valid authenticator code in addition to the user's password.

### API access control
- Protected endpoints require a valid JWT.
- Profile updates are restricted to the authenticated user's own profile.
- Club deletion is restricted to coordinator accounts.
- Coordinators can delete only their own club.
- Requests without authentication or with insufficient permissions are rejected.

### Docker hardening and Trivy scanning
The backend Docker image uses `node:22-alpine` and runs under a non-root user named `appuser`. Backend dependencies are separated from frontend dependencies in the Docker build.

Trivy was used to scan the Docker image for High and Critical vulnerabilities.

| Severity | Initial scan | Final recorded scan |
|---|---:|---:|
| High | 15 | 11 |
| Critical | 1 | 0 |
| **Total High + Critical** | **16** | **11** |

The final scan reported zero Critical and eleven High findings. Some High findings remain, so the image should not be considered vulnerability-free.

## ☁️ Proposed Cloud-Bursting Extension

A potential extension is to deploy additional backend instances in a cloud environment during periods of unusually high recruitment activity. The load balancer could route traffic to this additional capacity when needed.

This is a proposed extension and is not currently implemented in the application.

## ⚙️ Local Development

### Prerequisites
- Node.js and npm
- Docker Desktop and Docker Compose
- A MongoDB Atlas account or another compatible MongoDB deployment

### Run the frontend and backend locally

1. Clone the repository:

   ```bash
   git clone https://github.com/jovanajeboy/Club-Connect.git
   cd Club-Connect
   ```

2. Install the root project dependencies:

   ```bash
   npm install
   ```

3. Configure your local environment variables using your own credentials. Do not commit `.env` or `.env.local` files.

   The backend requires its MongoDB connection string and JWT signing secret. The frontend requires the appropriate API base URL.

4. Start the backend using your project's configured server command, and start the frontend:

   ```bash
   npm run dev
   ```

   The frontend development server and backend server may need to run in separate terminals. Configure the backend to use the expected port and make sure the frontend API URL points to it.

### Run the Docker load-balancing environment

With Docker Desktop running, use:

```bash
docker compose build
docker compose up -d
```

Check the container status:

```bash
docker compose ps
```

The Nginx entry point is:

```text
http://localhost:8080
```

Test the clubs endpoint:

```text
http://localhost:8080/api/clubs
```

Stop the containers when finished:

```bash
docker compose down
```

## 🔒 Environment Variables and Secrets

Configure credentials locally or through your hosting provider's environment settings.

Typical variables include:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used to sign and verify JWTs
- `VITE_API_URL` — frontend API base URL

Use strong, unique production secrets. Never commit real credentials, access tokens, MFA secrets, or QR codes containing active MFA setup secrets to GitHub.

## 📁 Main Project Structure

```text
Club-Connect/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
├── package-lock.json
└── README.md
```

Other frontend source files and assets are located in the root project and its corresponding source directories.

## 🎓 Project Outcomes

ClubConnect combines personalized club discovery with cloud deployment, container-based load balancing, authentication, MFA, API authorization, and Docker image security scanning. It provides a foundation for a more scalable and secure college club recruitment platform.

## 👩‍💻 Repository

Source code: [GitHub — Club-Connect](https://github.com/jovanajeboy/Club-Connect)
