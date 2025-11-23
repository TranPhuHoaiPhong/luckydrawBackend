import express from "express"
const router = express.Router()

import userRoutes from "./user.js"
import spinRoutes from "./spin.js"
import prizeRoutes from "./prize.js"
import historyRoutes from "./admin.js"

router.use("/user", userRoutes)
router.use("/spin", spinRoutes)
router.use("/prize", prizeRoutes)
router.use("/admin", historyRoutes)

export default router
