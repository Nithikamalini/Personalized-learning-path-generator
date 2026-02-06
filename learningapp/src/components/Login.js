// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Login({ handleLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      console.log("Attempting signup for:", email);
      const res = await axios.post(`${API_URL}/api/signup`, { email, password });
      alert(res.data.message || "Signup successful! Now login.");
      setIsLogin(true);
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.error || "Signup failed. Check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting login for:", email);
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      console.log("Login success response:", res.data);
      handleLoginSuccess(res.data);
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.error || "Login failed. Check server connection.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">🚀 Personalized Learning Path</h1>
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="login-form">
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isLogin ? (
            <button type="submit" className="login-btn login-btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          ) : (
            <button type="submit" className="login-btn login-btn-success" disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </button>
          )}
          <button
            type="button"
            className="login-btn login-btn-link"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            {isLogin ? "Create an account" : "Already have an account?"}
          </button>
        </form>
      </div>
    </div>
  );
}
