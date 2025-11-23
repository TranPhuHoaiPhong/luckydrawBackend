import express from "express";
import AdminController from "../controllers/History.js";
import { authAdmin } from "../middlewares/authMiddleware/authMiddleware.js";

const router = express.Router();

// Chỉ admin mới được đọc và update config
router.get("/config", AdminController.getConfig);
router.put("/config", AdminController.updateConfig);

export default router;
