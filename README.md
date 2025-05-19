# Employee Management System

This project is a full-stack employee management application with React frontend and Express backend using MySQL and Drizzle ORM.

## Project Structure

- `frontend/`: React application built with Vite, React Router, and Tailwind CSS
- `server/`: Express.js backend with MySQL database and Drizzle ORM

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   DATABASE_URL=mysql://root:@localhost:3306/react-project
   JWT_SECRET=auth
   ```

4. Set up the database:
   - Make sure MySQL is running
   - Create a database named `dbname`
   ```
   mysql -u root -e "CREATE DATABASE IF NOT EXISTS dbname"
   ```

5. Initialize the database schema using Drizzle:
   ```
   npx drizzle-kit push
   ```

6. Start the server:
   ```
   npm run dev
   ```

The server will run on http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will run on http://localhost:5173

## Features

- User authentication with JWT
- Department management
- Employee management
- Salary tracking

## Database Schema

- Users: Authentication and user management
- Department: Company departments with salary information
- Employee: Employee details linked to departments
- Salary: Salary calculations with deductions and net salary

## API Endpoints

The backend provides RESTful API endpoints for:
- User authentication (login/register)
- Department CRUD operations
- Employee CRUD operations
- Salary management
- Reports

## Technologies Used

### Backend
- Express.js
- MySQL
- Drizzle ORM
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 19
- React Router
- Axios for API requests
- Tailwind CSS

## Documentation Links

### Backend
- [Express.js](https://expressjs.com/en/guide/routing.html) - Backend framework
- [Drizzle ORM](https://orm.drizzle.team/docs/overview) - Database ORM
- [MySQL](https://dev.mysql.com/doc/) - Database
- [JWT](https://jwt.io/introduction) - Authentication
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing

### Frontend
- [React](https://react.dev/learn)
- [React Router](https://reactrouter.com/en/main) - Client-side routing
- [Vite](https://vitejs.dev/guide/) - Frontend build tool
- [Tailwind CSS](https://tailwindcss.com/docs) - CSS framework
- [Axios](https://axios-http.com/docs/intro) - HTTP client