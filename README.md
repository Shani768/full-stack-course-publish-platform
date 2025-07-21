# 🎓 Full Stack Course Platform

A scalable, full-featured **Learning Management System** built with:

- ⚛️ **React + Vite (TypeScript)** frontend
- 🚀 **Express.js (TypeScript)** backend
- 🐬 **MySQL** database
- ☁️ **Cloudinary** for video hosting
- 🔐 Secure authentication (Email + Google)
- 📧 Email services with Nodemailer
- 🛡️ Rate limiting for protection
- 🎞️ Multi-resolution video playback
- 🔍 Full-text search with debounce optimization

---

## watch Video
[Watch Demo Video](https://shani-project-videos.s3.eu-north-1.amazonaws.com/course/video.mp4)
---

## 🧰 Tech Stack

| Technology     | Role                    |
|----------------|-------------------------|
| React + Vite   | Frontend (TypeScript)   |
| Express.js     | Backend (TypeScript)    |
| MySQL          | Relational Database     |
| Prisma         | ORM                     |
| Cloudinary     | Video Upload/Streaming  |
| JWT / Google   | Auth                    |
| Nodemailer     | Email service           |
|  Rate-Limiter | API Protection   |
|  zustand       |  state managment |      |
---

## 🚀 Features

### ✅ **User Authentication**
- 🔐 Signup, Signin, Logout using JWT
- ✅ Email verification flow
- 🔗 Google OAuth login
- 📨 Send welcome/verification emails with Nodemailer

### 📚 **Course Management**
- 🆕 Create a course
- 📝 Edit, publish/unpublish, or delete a course
- 🧾 Organize courses into categories
- 🔍 Full-text course search with debounce
- 📂 Filter courses by category

### 📦 **Chapter Management**
- ➕ Add chapters to courses
- 🔁 Edit or delete individual chapters
- 📥 Upload chapter videos to Cloudinary

### 🎥 **Video Streaming**
- 🖥️ Stream videos in multiple resolutions:
  - 360p, 480p, 720p (adaptive)
- ⚙️ Cloudinary-transcoded and optimized

### 🛡️ **Security**
- 🚫 Implemented rate limiting (middleware)
- 🌍 CORS and environment-based config

### 🧠 **State Management**
- 🗂️ Global state handled with [Zustand](https://github.com/pmndrs/zustand)
- 🔐 Auth state, course data, UI state, etc. managed via simple stores

### 🎨 **UI Components**
- 💅 Built with [shadcn/ui](https://ui.shadcn.com/)
- ⚡ Fast, accessible, and highly customizable components
- 🎯 Designed using Tailwind CSS

### 📏 **Schema Validation**
- ✅ Input & backend request validation with [Zod](https://github.com/colinhacks/zod)
- 🔐 Ensures type-safe and secure form handling

---

## 🧪 Setup Instructions

### 1. 📁 Clone the Repository

```bash
git clone https://github.com/your-username/full-stack-course-publish-platform.git
cd full-stack-course-publish-platform

```
### backend

```bash 
   cd  backend             # Navigate to backend folder
npm install           # Install backend dependencies

# 🔄 Set up your database
npx prisma db push     # Push Prisma schema to your MySQL database
npx prisma generate    # Generate Prisma Client

# 👉 Run in development mode
npm run dev

# 🏁 For production
npm run build         # Build the backend
npm run start         # Run backend in production
```

### frontend 
```bash
cd frontend         # Navigate to frontend folder
npm install           # Install frontend dependencies

# 👉 Run in development mode
npm run dev

# 🏁 For production
npm run build         # Build the frontend
npm run preview       # Preview production frontend
```

## 📸 Screenshots


<div style="display: flex; justify-content: space-between;">
  <img src="https://shani-project-videos.s3.eu-north-1.amazonaws.com/course/course_image_1.png" width="400" height="700" />
  <img src="https://shani-project-videos.s3.eu-north-1.amazonaws.com/course/course_image_2.png" width="400" height="700" />
  <img src="https://shani-project-videos.s3.eu-north-1.amazonaws.com/course/course_image_3.png" width="400" height="700" />
</div>
