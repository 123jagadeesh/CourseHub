import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";

import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import CourseDetail from "./pages/CourseDetail";
import LectureView from "./pages/LectureView";

import StudentDashboard from "./pages/StudentDashboard";
import MyLearnings from "./pages/MyLearnings";

import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorManageCourse from "./pages/InstructorManageCourse";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="app-root">
      <Header />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/courses/:courseId/lectures/:lectureId" element={<LectureView />} />

        
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/student/mylearnings"
          element={
            <ProtectedRoute role="student">
              <MyLearnings />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/instructor"
          element={
            <ProtectedRoute role="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/courses/:courseId"
          element={
            <ProtectedRoute role="instructor">
              <InstructorManageCourse />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
