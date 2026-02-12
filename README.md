# ReliefCo – Disaster Relief Management Platform

ReliefCo is a full-stack disaster relief platform built to connect volunteers, donors, and administrators during times of crisis.

The application enables transparent donations, volunteer coordination, and efficient relief management through a centralized system.

---

## 🌍 About the Project

ReliefCo is dedicated to enhancing disaster relief efforts by connecting volunteers, donors, and organizations with those in need. Our platform is committed to building a resilient community capable of responding to crises swiftly and effectively.

### Our Mission
To deliver immediate and coordinated support to disaster-affected areas by mobilizing community resources and providing transparent donation processes.

### Our Vision
To build a connected and resilient society that can respond effectively to any crisis, ensuring community-driven relief efforts are accessible to all.

### Core Values
Integrity, Transparency, Community, and Compassion drive every decision made within the ReliefCo platform.

---

# 🏗 Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS

Backend:
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO

Infrastructure:
- Docker
- Docker Compose
- Nginx Reverse Proxy
- Custom Docker Network
- Named Volumes

---

# 🐳 Containerized Architecture

This project is fully containerized using Docker and Docker Compose.

Services included:

- **Nginx** – Reverse proxy (Public entry point)
- **Backend (Node.js)** – API service
- **MongoDB** – Private database
- **Frontend (React Build served via Nginx)**

---

# 🔐 Production-Ready Design Decisions

### 1. Database Privacy

MongoDB is not exposed to the host machine.

Instead of:
```
ports:
```

We used:
```
expose:
```

This ensures the database is only accessible within the internal Docker network.

---

### 2. Persistent Storage

A named volume is attached to MongoDB:

```
mongo-data:/data/db
```

This guarantees that database data persists even if containers are restarted or removed.

---

### 3. Reverse Proxy

Nginx acts as the single public entry point.

- Port 80 exposed to host
- Routes `/api` traffic to backend
- Routes `/` traffic to frontend

This creates a clean production-like setup.

---

### 4. Multi-Stage Frontend Build

Frontend Dockerfile uses multi-stage build:

1. Build stage using Node
2. Production stage using Nginx

This ensures:
- Smaller final image
- No development dependencies in runtime
- Faster performance

---

# 🐞 Debugging & Issues Faced

During containerization, several issues were encountered and resolved:

---

### Issue 1: MongoDB Connection Failed

Initial error occurred because:

```
mongodb://localhost:27017/...
```

Inside Docker, `localhost` refers to the container itself.

Solution:
Changed connection string to:

```
mongodb://mongo:27017/minorproject
```

Using service name for inter-container communication.

---

### Issue 2: Rollup Build Failure (Alpine Image)

Frontend build failed with:

```
Cannot find module @rollup/rollup-linux-x64-musl
```

Cause:
`node:18-alpine` uses musl libc which caused native dependency issues.

Solution:
Switched build stage to:

```
FROM node:18
```

Debian-based image resolved the issue.

---

### Issue 3: Nginx Volume Mount Error

Error:

```
not a directory: Are you trying to mount a directory onto a file?
```

Cause:
Mounted a folder instead of file.

Solution:
Ensured correct file mapping:

```
./nginx/default.conf:/etc/nginx/conf.d/default.conf
```

---

### Issue 4: Multi-Stage Build Naming Error

Initial Dockerfile missed:

```
AS build
```

Which caused Docker to search for external image named "build".

Solution:
Defined proper stage alias:

```
FROM node:18 AS build
```

---

# 🚀 How to Run the Project

### Clone repository

```
git clone <your-repo-url>
cd dockerprojects
```

### Build and Start

```
docker compose up -d --build
```

### Access Application

Open in browser:

```
http://localhost
```

---

# 📦 Container Overview

```
docker ps
```

Expected containers:

- nginx
- backend
- mongo
- frontend

---

# 📌 Key Learnings

- Docker networking uses service names for internal communication.
- Databases should not expose ports in production.
- Multi-stage builds reduce image size.
- Alpine images can cause native dependency issues.
- Correct volume mounting requires file-to-file mapping.
- Reverse proxy architecture improves production readiness.

---

# 📄 License

This project is for educational and learning purposes.
