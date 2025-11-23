import express from "express"
import SpinController from "../controllers/Spin.js"
import {authenticateToken} from "../middlewares/authMiddleware/authMiddleware.js"
const router = express.Router();

router.post("/spin", authenticateToken, SpinController.spin);
router.get("/history", SpinController.getHistory);

export default router;