import React from "react";
import { Link } from "react-router-dom";
import CoursesGrid from "./_partials/CoursesGrid";

export default function Landing() {
  return (
    <div className="page landing">
      <header className="hero">
        <div className="container">
          <h1>CourseHub</h1>
          <p>Learn from instructors or publish your own courses.</p>
          <div className="hero-actions">
            <Link to="/auth" className="btn">Sign In / Sign Up</Link>
          </div>
        </div>
      </header>

      <main className="container">
        <h2>Explore Courses</h2>
        <CoursesGrid />
      </main>
    </div>
  );
}
