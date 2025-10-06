import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

export default function Header({ query, setQuery, showSearchBar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    if (setQuery) {
      setQuery(e.target.value);
    }
  };

  const handleHomeClick = () => {
    if (user && user.role === "instructor") {
      navigate("/instructor");
    } else {
      navigate("/student/dashboard");
    }
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left-section">
          <Link to="/" className="brand-logo">CourseHub</Link>
          <nav className="nav-links">
            <button onClick={handleHomeClick} className="nav-link btn-home">Home</button>
            {user && user.role === "student" && <Link to="/student/mylearnings" className="nav-link">My Learnings</Link>}
            {user && user.role === "instructor" && <Link to="/instructor" className="nav-link">Instructor</Link>}
          </nav>
        </div>
        <div className="header-right-section">
          {showSearchBar && (
            <input
              placeholder="Search courses..."
              value={query}
              onChange={handleSearchChange}
              className="header-search-input"
            />
          )}

          {!user && (
            <div className="auth-buttons-group">
              <Link to="/auth?role=student" className="btn">Student Sign Up / Sign In</Link>
              <Link to="/auth?role=instructor" className="btn">Instructor Sign Up / Sign In</Link>
            </div>
          )}

          {user && (
            <div className="user-info-group">
              <span className="user-info">{user.name} ({user.role})</span>
              <button onClick={() => { logout(); navigate("/"); }} className="btn btn-logout">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
