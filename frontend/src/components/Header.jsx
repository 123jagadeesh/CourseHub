// src/components/Header.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, height: 64, background: "#fff", borderBottom: "1px solid #eee", zIndex: 50 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: "#111", textDecoration: "none" }}>CourseHub</Link>
          <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#333", textDecoration: "none", fontSize: 14 }}>Explore</Link>
            {user && user.role === "student" && <Link to="/student/mylearnings" style={{ color: "#333", textDecoration: "none", fontSize: 14 }}>My Learnings</Link>}
            {user && user.role === "instructor" && <Link to="/instructor" style={{ color: "#333", textDecoration: "none", fontSize: 14 }}>Instructor</Link>}
          </nav>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!user && (
            <>
              <Link to="/auth?role=student" className="btn" style={{ padding: "6px 10px" }}>Student Sign Up / Sign In</Link>
              <Link to="/auth?role=instructor" className="btn" style={{ padding: "6px 10px" }}>Instructor Sign Up / Sign In</Link>
            </>
          )}

          {user && (
            <>
              <span style={{ fontSize: 14, color: "#333" }}>{user.name} ({user.role})</span>
              <button onClick={() => { logout(); navigate("/"); }} className="btn" style={{ background: "#e53935", color: "#fff", padding: "6px 10px" }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
