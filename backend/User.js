const mongoose = require("mongoose");

const PathSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  role: { type: String, default: "" },
  gender: { type: String, default: "" },
  nationality: { type: String, default: "" },
  skills: {
    python: { type: Number, default: 0 },
    sql: { type: Number, default: 0 },
    ds: { type: Number, default: 0 },
    javascript: { type: Number, default: 0 },
    java: { type: Number, default: 0 },
    mongodb: { type: Number, default: 0 },
  },
  goal: { type: String, default: "" },
  path: [PathSchema],
});

module.exports = mongoose.model("User", UserSchema);
