# TeamSpace Collaborative Platform

# Introduction
TeamSpace is a collaborative platform built with React and Firebase, designed to facilitate team collaboration and project management. The platform provides features for task management, real-time collaboration, and team communication.

# Project Type
Frontend (React + Firebase)

# Deployed App
https://delicate-froyo-2e7d24.netlify.app/

# Directory Structure

project/
├─ src/
│  ├─ components/
│  ├─ contexts/
│  ├─ hooks/
│  ├─ layouts/
│  ├─ lib/
│  ├─ pages/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ public/
├─ node_modules/
└─ configuration files

# Video Walkthrough of the Project
https://youtu.be/FylU_dnxuII

# Features
Based on the dependencies and project structure, the application includes:
- Real-time collaboration using Firebase
- Drag and drop functionality (react-beautiful-dnd)
- Rich text editing capabilities (react-quill)
- Toast notifications for user feedback (react-hot-toast)
- State management with Zustand
- Responsive UI with Tailwind CSS
- handling and formatting (date-fns)
- Icon system (lucide-react)

# Design Decisions or Assumptions
1. State Management: Using Zustand for its simplicity and performance
2. UI Framework: Tailwind CSS for rapid development and consistent styling
3. Real-time Features: Firebase for real-time updates and authentication
4. Type Safety: TypeScript for better development experience and type safety
5. Build Tool: Vite for faster development and build times

# Installation & Getting Started

Clone the repository:
git clone https://github.com/vinit3200/TeamSpace_RCT305-B45.git
cd project
npm install
npm rundev

# Firebase Setup:
Add your Firebase config in frontend/firebase.js
Enable Authentication (email/password)
Set up Firestore and Realtime Database

# Usage
Create a workspace:
- Click "Create Workspace" > Enter name of workspace > Add some description > Start collaborating

Upload a file:
- Go to workspace > Upload > Select file > Add comments

Start a chat:
- Open workspace > Click chat icon > Type message

# Credentials
Use the following credentials to test the app:
Email: demo@teamspace.com
Password: demo123

# APIs Used
Firebase Auth, Firestore, Realtime Database

# Technology Stack
- Frontend Framework: React 18
- Build Tool: Vite
- Styling: Tailwind CSS
- State Management: Zustand
- Database & Authentication: Firebase
- Type Checking: TypeScript
- Code Quality: ESLint
- UI Components:
react-beautiful-dnd (Drag and Drop)
react-quill (Rich Text Editor)
react-hot-toast (Notifications)
lucide-react (Icons)
- Date Handling: date-fns
- Routing: react-router-dom

# APIs Used
- Firebase Services:
Authentication
Firestore Database
Real-time Updates