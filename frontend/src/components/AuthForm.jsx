import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function AuthForm() {
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
        if (data.role === "instructor") navigate("/instructor");
        else navigate("/student/dashboard");
      } else {
        const data = await register(name || email.split("@")[0], email, password, role);
        if (data.role === "instructor") navigate("/instructor");
        else navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-tabs">
        <button onClick={() => setIsLogin(true)} className={`btn ${isLogin ? "btn-primary" : "btn-secondary"}`}>Login</button>
        <button onClick={() => setIsLogin(false)} className={`btn ${!isLogin ? "btn-primary" : "btn-secondary"}`}>Register</button>
      </div>

      <form onSubmit={onSubmit} className="auth-form">
        {!isLogin && <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="input" />}
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />

        {!isLogin && (
          <div className="auth-form-role-select">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
        )}

        <div className="auth-form-actions">
          <button type="submit" className="btn btn-primary">{isLogin ? "Login" : "Register"}</button>
          <button type="button" className="btn btn-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
