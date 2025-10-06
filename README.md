# CourseHub - Online Learning Platform

## Project Overview
CourseHub is a simple online learning platform designed to facilitate course creation by instructors and sequential learning by students. Instructors can create courses, add various types of lectures (reading and quiz), and manage their learners. Students can browse available courses, enroll, track their progress, and attempt quizzes with server-side grading. The platform features a clean, responsive, and modular UI, ensuring a smooth learning experience across different devices.

## Setup Instructions
To set up and run CourseHub locally, please follow these steps:

### Prerequisites
- Node.js (v14 or higher) and npm (or yarn)
- MongoDB (local installation or a cloud-based service like MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone "https://github.com/123jagadeesh/CourseHub.git"
cd CourseHub
```

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Install backend dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory and add the following environment variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
- Replace `your_mongodb_connection_string` with your MongoDB connection URI (e.g., `mongodb://localhost:27017/coursehub` for local or an Atlas connection string).
- Replace `your_jwt_secret_key` with a strong, random string for JWT token signing.

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory:
```bash
cd frontend
```

Install frontend dependencies:
```bash
npm install
```

### 4. Running the Application

#### Run Backend
In the `backend` directory, start the server:
```bash
npm start
```
This will start the backend server on `http://localhost:5000` (or your specified PORT).

#### Run Frontend
In the `frontend` directory, start the React development server:
```bash
npm start
```
This will open the application in your browser at `http://localhost:3000`.

## Project Architecture and Technology Choices

### Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js (Express.js)
- **Database**: MongoDB

### Architecture Description
CourseHub follows a classic **Client-Server architecture** with a clear separation of concerns between the frontend and backend.

-   **Frontend (React.js)**:
    -   Built with React.js for a dynamic and responsive user interface.
    -   Utilizes React Router for client-side navigation.
    -   State management is handled using React Hooks (`useState`, `useEffect`, `useContext`) for both local component state and global authentication context (`AuthContext`).
    -   API integration is managed through an `api.js` wrapper using `axios` for cleaner, centralized API calls.
    -   The UI is designed with a modular component-based approach, ensuring reusability, maintainability, and responsiveness across various screen sizes using CSS.

-   **Backend (Node.js with Express.js)**:
    -   Developed with Node.js and the Express.js framework for building robust RESTful APIs.
    -   **Controllers**: Handle business logic and interact with models (e.g., `courseController.js`, `progressController.js`).
    -   **Models**: Define Mongoose schemas for MongoDB, representing data structures like `User`, `Course`, `Lecture`, and `Progress`.
    -   **Routes**: Define API endpoints using Express Router to manage different functionalities (e.g., `authRoutes.js`, `courseRoutes.js`, `progressRoutes.js`).
    -   **Middleware**: Implements authentication (`authMiddleware.js`) using JWT (JSON Web Tokens) for protecting routes and handling role-based authorization.
    -   **Utilities**: Includes helper functions for tasks like quiz grading (`quizGrader.js`) and sanitizing lecture data (`sanitizeLecture.js`).

-   **Database (MongoDB)**:
    -   A NoSQL document database used for storing all application data, including user information, course details, lecture content, and student progress.
    -   Mongoose ODM (Object Data Modeling) is used in the backend to interact with MongoDB, providing a schema-based solution to model application data.

### Reasons for Technology Choices
-   **React.js**: Chosen for its component-based architecture, which promotes reusability and makes it efficient for building complex and interactive UIs. Its vibrant ecosystem and strong community support also contribute to faster development.
-   **Node.js & Express.js**: Selected for their JavaScript-centric environment, allowing for a single language across the entire stack (full-stack JavaScript development). Express.js provides a minimalistic and flexible framework for building scalable APIs.
-   **MongoDB**: Opted for its flexibility and scalability as a NoSQL database. It's particularly well-suited for applications with evolving data structures and can handle large volumes of data efficiently. Its JSON-like document structure aligns well with JavaScript, simplifying data handling between frontend and backend.

