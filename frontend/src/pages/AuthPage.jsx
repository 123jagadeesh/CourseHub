// src/pages/AuthPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const qp = new URLSearchParams(location.search);
    const r = qp.get("role");
    if (r === "student" || r === "instructor") {
      setRole(r);
    }
  }, [location.search]);

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await login(email, password);
        // redirect to appropriate dashboard
        if (data.role === "instructor") navigate("/instructor");
        else navigate("/student/dashboard"); // <- go to student dashboard (public courses)
      } else {
        const data = await register(name || email.split("@")[0], email, password, role);
        if (data.role === "instructor") navigate("/instructor");
        else navigate("/student/dashboard"); // <- go to student dashboard
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="container" style={{ paddingTop: 96 }}>
      <div style={{ maxWidth: 520, margin: "0 auto", background: "#fff", padding: 20, borderRadius: 8, border: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setIsLogin(true)} className="btn" style={{ background: isLogin ? "#1976d2" : "#f0f0f0", color: isLogin ? "#fff" : "#333" }}>Login</button>
          <button onClick={() => setIsLogin(false)} className="btn" style={{ background: !isLogin ? "#1976d2" : "#f0f0f0", color: !isLogin ? "#fff" : "#333" }}>Register</button>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!isLogin && <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="input" />}
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />

          {!isLogin && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 13 }}>Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="submit" className="btn">{isLogin ? "Login" : "Register"}</button>
            <button type="button" className="btn btn-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Switch to Register" : "Switch to Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
