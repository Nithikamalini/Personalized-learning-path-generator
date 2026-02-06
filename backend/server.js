require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const User = require("./User"); // User model
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/learningPathDB";

// Connect to MongoDB
console.log("Attempting to connect to MongoDB at:", MONGO_URI);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error!");
    console.error("Check if your MongoDB service is running.");
    console.error("Error details:", err.message);
  });

// ---------------- Routes ---------------- //

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    res.json({ message: "Signup successful! Please login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid password" });

    res.json({
      userId: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      gender: user.gender,
      nationality: user.nationality,
      skills: user.skills,
      goal: user.goal,
      path: user.path,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Save/Update Learning Path (Existing)
app.post("/api/savePath", async (req, res) => {
  try {
    const { userId, skills, goal, path } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.skills = skills;
    user.goal = goal;
    user.path = path;
    await user.save();

    res.json({ message: "Path saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error saving path" });
  }
});

// Update User (Matches frontend expectation)
app.post("/api/updateUser", async (req, res) => {
  try {
    const { userId, name, phone, role, gender, nationality, skills, goal, path } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (gender !== undefined) user.gender = gender;
    if (nationality !== undefined) user.nationality = nationality;
    if (skills) user.skills = skills;
    if (goal) user.goal = goal;
    if (path) user.path = path;

    await user.save();
    res.json({ message: "User updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error updating user" });
  }
});

// Get Learning Path
app.get("/api/getPath/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      skills: user.skills,
      goal: user.goal,
      path: user.path,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching path" });
  }
});
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});


// ---------------- Start Server ---------------- //
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`Please close any other running instances of the server.`);
  } else {
    console.error("❌ Server error:", err);
  }
});

// Get all users (admin view)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // exclude password
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching users" });
  }
});

// Get single user by ID
app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching user" });
  }
});

// Update skills, goal, or path
app.put("/api/user/:id", async (req, res) => {
  try {
    const { skills, goal, path } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (skills) user.skills = skills;
    if (goal) user.goal = goal;
    if (path) user.path = path;

    await user.save();
    res.json({ message: "User updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error updating user" });
  }
});

// Delete user
app.delete("/api/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error deleting user" });
  }
});
