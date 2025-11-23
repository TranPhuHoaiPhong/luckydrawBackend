import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import config from "./config/config.js";
import apiRouter from "./routes/index.js";
// import { registerEventListeners } from "./services/listener.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/assets/images/prizes", express.static(path.join(__dirname, "assets/images/prizes")));


// Kết nối MongoDB
mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    // registerEventListeners();  // Lắng nghe sự kiện blockchain
  })
  .catch((err) => console.log("MongoDB error:", err));

// API
app.use("/api", apiRouter);

app.listen(5000, () => console.log("Backend running on port 5000"));
  