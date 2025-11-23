// services/prize.service.js
import Prize from "../models/Prize.js";

class PrizeService {
  async createPrize(data) {
    return await Prize.create(data);
  }

  async getAllPrizes() {
    return await Prize.find().sort({ createdAt: -1 });
  }

  async getPrizeById(id) {
    const prize = await Prize.findById(id);
    if (!prize) throw new Error("Prize không tồn tại");
    return prize;
  }

  async updatePrize(id, data) {
    const updated = await Prize.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new Error("Prize không tồn tại");
    return updated;
  }

  async deletePrize(id) {
    const deleted = await Prize.findByIdAndDelete(id);
    if (!deleted) throw new Error("Prize không tồn tại");
    return deleted;
  }
}

export default new PrizeService();
