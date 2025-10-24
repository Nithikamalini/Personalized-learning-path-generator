// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [skills, setSkills] = useState({ python: 7, sql: 3, ds: 5 });
  const [goal, setGoal] = useState("Become a Data Scientist");
  const [path, setPath] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  // User login/signup state
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Toggle completed topics
  const toggleComplete = (index) => {
    const updated = [...path];
    updated[index].completed = !updated[index].completed;
    setPath(updated);
    updateProgress(updated);
  };

  const updateProgress = (list = path) => {
    if (!list.length) {
      setProgress(0);
      return;
    }
    const completed = list.filter((i) => i.completed).length;
    setProgress(Math.round((completed / list.length) * 100));
  };

  const clearPath = () => {
    setPath([]);
    setProgress(0);
  };

  // Show resources alert
  const showResources = (topic) => {
    alert(
      `Resources for: ${topic}\n\n• Search YouTube for "${topic} tutorial"\n• Look for free courses (Coursera / edX / YouTube)\n• Try small projects to practice.`
    );
  };

  // Generate path and save to backend
  const generatePath = async () => {
    try {
      const newPath = [
        { text: "Learn Python Basics", completed: false },
        { text: "Learn SQL Basics", completed: false },
        { text: "Learn Data Structures", completed: false },
      ];
      setPath(newPath);
      updateProgress(newPath);

      if (userId) {
        const res = await axios.post("http://localhost:5000/api/savePath", {
          userId,
          skills,
          goal,
          path: newPath,
        });
        console.log(res.data);
      }
    } catch (error) {
      console.error("Error saving path:", error.response?.data || error);
      alert(error.response?.data?.message || "Error saving path");
    }
  };

  // User signup/login functions
  const handleSignup = async () => {
    try {
      console.log("Signup data:", { email, password });
      const res = await axios.post("http://localhost:5000/api/signup", {
        email,
        password,
      });
      console.log(res.data);
      alert(res.data.message || "Signup successful! Now login.");
      setIsLogin(true);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err);
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Login data:", { email, password });
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      console.log("Login response:", res.data);
      setUserId(res.data.userId);
      setSkills(res.data.skills);
      setGoal(res.data.goal);
      setPath(res.data.path);
      updateProgress(res.data.path);
      setShowWelcome(false);
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      alert(err.response?.data?.error || "Login failed");
    }
  };

  // Fetch user path if logged in
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/getPath/${userId}`)
        .then((res) => {
          setSkills(res.data.skills);
          setGoal(res.data.goal);
          setPath(res.data.path);
          updateProgress(res.data.path);
        })
        .catch((err) => console.error("Fetch path error:", err.response?.data || err));
    }
  }, [userId]);

  // ----------- JSX ----------
  if (showWelcome) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
          color: "#333",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontWeight: "700" }}>
          🚀 Welcome to Personalized Learning Path
        </h1>
        <p style={{ maxWidth: "600px", marginTop: "12px" }}>
          This app will generate a step-by-step roadmap based on your current
          skills and learning goals.
        </p>

        {/* Login / Signup */}
        <div style={{ marginTop: "20px", maxWidth: 300 }}>
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isLogin ? (
            <button
              className="btn btn-primary w-100 mb-2"
              onClick={handleLogin}
            >
              Login
            </button>
          ) : (
            <button
              className="btn btn-success w-100 mb-2"
              onClick={handleSignup}
            >
              Signup
            </button>
          )}
          <button
            className="btn btn-link w-100"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create an account" : "Already have an account?"}
          </button>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div>
      <header className="hero" style={{ background: "#335fd1", color: "#fff", padding: "48px 0" }}>
        <div className="container d-flex justify-content-between align-items-start">
          <div>
            <h1 style={{ fontWeight: 700 }}>Personalized Learning Path Generator</h1>
            <p className="mt-2 mb-0" style={{ opacity: 0.9 }}>
              Generate a step-by-step roadmap based on skills & goal
            </p>
          </div>
        </div>
      </header>

      <main className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* LEFT */}
            <div className="col-lg-7">
              <div className="card p-4 mb-4">
                <h4 className="mb-3">Skill Assessment</h4>
                {["Python", "SQL", "Data Structures"].map((label, i) => {
                  const key = ["python", "sql", "ds"][i];
                  return (
                    <div key={key} className="row align-items-center mb-3">
                      <div className="col-4">{label}</div>
                      <div className="col-6">
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={skills[key]}
                          className="form-range"
                          onChange={(e) =>
                            setSkills({ ...skills, [key]: parseInt(e.target.value, 10) })
                          }
                        />
                      </div>
                      <div className="col-2 text-end">
                        <div
                          className="skill-badge border rounded-circle d-inline-flex justify-content-center align-items-center"
                          style={{ width: 44, height: 44, fontWeight: 600 }}
                        >
                          {skills[key]}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <hr />
                <div className="row">
                  <div className="col-8">
                    <label className="form-label fw-semibold">Choose your learning goal</label>
                    <select
                      className="form-select"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    >
                      <option>Become a Data Scientist</option>
                      <option>Become a Full Stack Web Developer</option>
                      <option>Become a Machine Learning Engineer</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div className="col-4 d-flex align-items-end">
                    <button className="btn btn-primary w-100 mt-2" onClick={generatePath}>
                      Generate Path
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-lg-5">
              <div className="card p-4 mb-4">
                <h5 className="mb-3">Learning Path</h5>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>Progress</div>
                  <div style={{ width: 160 }}>
                    <div className="progress" style={{ height: 10 }}>
                      <div className="progress-bar" role="progressbar" style={{ width: progress + "%" }}>
                        {progress}%
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  {path.map((item, i) => (
                    <li key={i} className="list-group-item d-flex align-items-center justify-content-between">
                      <div className={item.completed ? "text-decoration-line-through text-muted" : ""}>
                        {i + 1}. {item.text}
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-success" onClick={() => toggleComplete(i)}>
                          {item.completed ? "Undo" : "Mark"}
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => showResources(item.text)}>
                          Resources
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-muted">
        © {new Date().getFullYear()} Personalized Learning — built with Bootstrap
      </footer>
    </div>
  );
}

export default App;