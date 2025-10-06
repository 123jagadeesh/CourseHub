import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function LandingHero() {
  return (
    <header className="landing-hero">
      <div className="landing-hero-content">
        <div>
          <h1 className="landing-hero-title">CourseHub</h1>
          <p className="landing-hero-description">A simple online learning platform — instructors create courses, students enroll and learn sequentially.</p>
        </div>

        <div className="landing-hero-actions">
          <Link to="/auth" className="btn landing-hero-button">Sign In / Sign Up</Link>
        </div>
      </div>
    </header>
  );
}
