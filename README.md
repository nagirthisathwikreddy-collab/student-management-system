# Student Management System

A beginner-friendly minimalist Student Management System mini-project built for university.

## Features
- Minimalist, clean UI using HTML, CSS, JavaScript
- Node.js + Express backend
- JSON file-based database (No MySQL required, easy setup)
- CRUD Operations (Add, View, Edit, Delete)
- Basic login authentication
- Search functionality by name or Student ID

## Setup Instructions

1. **Prerequisites**
   Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

2. **Run Dependency Install**
   Open the terminal in the root directory of this project and run:
   ```bash
   npm install
   ```

3. **Start the Backend Server**
   Start the Node.js server to run the backend and API:
   ```bash
   npm start
   ```
   *The server will run on `http://localhost:3000`*

4. **Access the Application**
   Open your browser and navigate to:
   [http://localhost:3000/](http://localhost:3000/)

## Default Credentials
- **Username:** `admin`
- **Password:** `admin`

## Folder Structure
- `backend/` - Contains the Express server code (`server.js`).
- `database/` - Stores data locally in `students.json`.
- `frontend/` - Contains HTML, CSS, and vanilla JS for the user interface.
