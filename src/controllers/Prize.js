// controllers/prize.controller.js
import PrizeService from "../services/Prize.js";

class PrizeController {

  // ➕ Thêm prize kèm upload ảnh
  async create(req, res) {
    try {
      const { file } = req;
      if (!file) return res.status(400).json({ success: false, message: "Chưa upload ảnh" });

      const imageUrl = `/assets/images/prizes/${file.filename}`;
      const prize = await PrizeService.createPrize({ ...req.body, imageUrl });

      res.status(201).json({ success: true, prize });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // 🔍 Xem tất cả
  async getAll(req, res) {
    try {
      const prizes = await PrizeService.getAllPrizes();
      res.status(200).json({ success: true, prizes });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // 🔍 Xem 1 prize
  async getOne(req, res) {
    try {
      const prize = await PrizeService.getPrizeById(req.params.id);
      res.status(200).json({ success: true, prize });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // ✏ Sửa prize (có thể thay ảnh)
  async update(req, res) {
    try {
      const { file } = req;
      const data = { ...req.body };

      if (file) {
        data.imageUrl = `/assets/images/prizes/${file.filename}`;
      }

      const updated = await PrizeService.updatePrize(req.params.id, data);
      res.status(200).json({ success: true, prize: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // ❌ Xoá prize
  async delete(req, res) {
    try {
      await PrizeService.deletePrize(req.params.id);
      res.status(200).json({ success: true, message: "Prize đã xoá" });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
}

export default new PrizeController();
