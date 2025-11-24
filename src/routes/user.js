import express from "express"
const router = express.Router()

import UserController from "../controllers/User.js"
import upload from "../middlewares/upload.js"

router.post("/create", UserController.createUser)
router.get("/view-all", UserController.getAllUsers)
router.get("/view-detail/:id", UserController.getUserById)
router.put("/update/:id", upload.single("image"), UserController.updateUser)
router.delete("/delete/:id", UserController.deleteUser)
router.post("/login", UserController.login)
router.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_Token; // đọc từ cookie
    if (!refreshToken) throw new Error("Không tìm thấy refresh token");

    const data = await refreshTokenJwtService(refreshToken);

    return res.json(data);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});


export default router
