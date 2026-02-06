// src/components/ProfileInfo.js
import React, { useState } from "react";
import "./ProfileInfo.css";

export default function ProfileInfo({ onProfileSubmit }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    gender: "",
    nationality: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onProfileSubmit(form);
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <h2>Enter Your Details</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Name:</label>
        <input name="name" type="text" value={form.name} onChange={handleChange} required />

        <label>Phone Number:</label>
        <input name="phone" type="text" value={form.phone} onChange={handleChange} required />

        <label>Role:</label>
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Student">Student</option>
          <option value="Fresher">Fresher</option>
        </select>

        <label>Gender:</label>
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Nationality:</label>
        <input name="nationality" type="text" value={form.nationality} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
