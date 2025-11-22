import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  maxSpinsPerUser: Number,
  spinEnabled: Boolean,
  startTime: Date,
  endTime: Date,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Admin", AdminSchema);