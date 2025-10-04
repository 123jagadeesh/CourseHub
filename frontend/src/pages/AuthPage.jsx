import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const u = await login(email, password);
        navigate(u.role === "instructor" ? "/instructor" : "/student/mylearnings");
      } else {
        const u = await register(name || email.split("@")[0], email, password, role);
        navigate(u.role === "instructor" ? "/instructor" : "/student/mylearnings");
      }
    } catch (err) {
      alert("Auth failed. Check console.");
      console.error(err);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-box">
        <h2>{isLogin ? "Sign In" : "Register"}</h2>
        <form onSubmit={onSubmit}>
          {!isLogin && <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />}
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="role-select">
            <label>Role: </label>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <div className="auth-actions">
            <button className="btn" type="submit">{isLogin ? "Login" : "Register"}</button>
            <button type="button" className="btn-link" onClick={()=>setIsLogin(v=>!v)}>
              {isLogin ? "Switch to Register" : "Switch to Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
