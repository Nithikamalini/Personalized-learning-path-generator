const mongoose = require("mongoose");

const PathSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: {
    python: { type: Number, default: 0 },
    sql: { type: Number, default: 0 },
    ds: { type: Number, default: 0 },
  },
  goal: { type: String, default: "" },
  path: [PathSchema],
});

module.exports = mongoose.model("User", UserSchema);
