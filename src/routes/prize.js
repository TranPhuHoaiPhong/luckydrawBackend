// routes/prize.route.js
import express from "express";
import PrizeController from "../controllers/Prize.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// POST thêm prize kèm 1 file ảnh
router.post("/", upload.single("image"), PrizeController.create);

// GET tất cả prize
router.get("/", PrizeController.getAll);

// GET 1 prize
router.get("/:id", PrizeController.getOne);

// PUT sửa prize, có thể kèm file mới
router.put("/:id", upload.single("image"), PrizeController.update);

// DELETE xoá prize
router.delete("/:id", PrizeController.delete);

export default router;
