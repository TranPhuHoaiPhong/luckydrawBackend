import mongoose from "mongoose";

const SpinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  prizeId: { type: mongoose.Schema.Types.ObjectId, ref: "Prize", default: null },
  rewardType: { type: String, enum: ["token","nft","none"] },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Spin", SpinSchema);