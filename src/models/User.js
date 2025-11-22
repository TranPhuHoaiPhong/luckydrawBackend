import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: { type: String, unique: true },  // hashed
  role: { type: String, enum: ["admin","player"], default: "player" },
  avatarUrl: String,
  wallet: String,
  spinsLeft: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("User", UserSchema);