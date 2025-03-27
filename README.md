# Expense-Management


A full-stack Expense Manager application built with **React (Vite) + TypeScript** for the frontend and **Node.js + Express + PostgreSQL** for the backend.

## Features
- Add, view, and delete expenses
- Categories for expenses (Food, Transport, Shopping, Bills, etc.)
- Persistent data storage using PostgreSQL
- REST API for managing expenses

## Tech Stack
### Frontend
- Vite + React + TypeScript
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js + Express
- PostgreSQL + pg (node-postgres)
- CORS & dotenv

---

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/expense-manager.git
cd expense-manager
```

### 2. Setup Backend
```sh
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the backend directory and add:
```
PORT=3000
DATABASE_URL=your_postgresql_connection_string
```

#### Run Backend Server
```sh
npm start
```
The server will run on `http://localhost:3000`

### 3. Setup Frontend
```sh
cd ../frontend
npm install
```

#### Start Frontend
```sh
npm run dev
```
The frontend will run on `http://localhost:5173`

---

## Pushing to GitHub

1. Initialize Git
```sh
git init
```
2. Add remote repository
```sh
git remote add origin https://github.com/your-username/expense-manager.git
```
3. Add files and commit
```sh
git add .
git commit -m "Initial commit"
```
4. Push to GitHub
```sh
git branch -M main
git push -u origin main
```

Now your project is live on GitHub! 🚀

