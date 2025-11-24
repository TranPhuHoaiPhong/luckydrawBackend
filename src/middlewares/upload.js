// middlewares/upload.middleware.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Tạo folder nếu chưa tồn tại
const avatarDir = path.join(__dirname, "../assets/images/prizes");
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.toLowerCase().split('.').pop();
  const allowed = ["jpeg","jpg","png"];
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("File type not supported"), false);
};


const upload = multer({ storage, fileFilter });

export default upload;
