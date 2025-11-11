Research Project Tracker - Frontend

A responsive React + TypeScript frontend application for managing research projects, milestones, and documents with JWT authentication.

 Features

Authentication System: JWT-based login and registration
Role-Based Access Control: Admin and User roles with restricted routes
Project Management: Complete CRUD operations for research projects
Milestone Tracking: Create and manage project milestones
Document Management: Upload, download, and manage project documents
Admin Dashboard: System-wide statistics and overview
Responsive Design: Mobile and desktop friendly using React Bootstrap


Prerequisites

Node.js (v16 or higher)
npm or yarn
Running Spring Boot backend API (default: http://localhost:8080)

 Installation

Clone the repository

bashgit clone https://github.com/ydksoysa/frontend_researchTracker.git
cd research-tracker

Install dependencies

bashnpm install

Configure API endpoint (if different from default)
Edit src/services/api.ts and update the API_BASE_URL:

typescriptconst API_BASE_URL = 'http://localhost:8080/api';

Start the development server

bashnpm start
The application will open at http://localhost:3000

 Tech Stack

React 18 with TypeScript
React Router v6 for SPA navigation
Axios for API communication
Context API for state management
React Bootstrap for UI components
JWT Decode for token handling
