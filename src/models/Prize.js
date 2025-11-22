import mongoose from "mongoose";

const PrizeSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ["token","nft","none"] }, 
  imageUrl: String,        // cho NFT hoặc hình minh họa
  quantity: Number,        // số lượng còn lại
  probability: Number,     // % trúng
  rarity: { type: String, enum: ["common","rare","legendary"], default: "common" },
  createdAt: { type: Date, default: Date.now }
}
)

export default mongoose.model("Prize", PrizeSchema);