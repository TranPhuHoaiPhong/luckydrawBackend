import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN;

/**
 * Middleware xác thực token JWT chung
 */
export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ status: "ERROR", message: "Token không tồn tại" });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ status: "ERROR", message: "Token không hợp lệ" });
      }
      req.user = decoded; // lưu thông tin user vào req
      next();
    });
  } catch (error) {
    return res.status(500).json({ status: "ERROR", message: "Lỗi xác thực người dùng" });
  }
};

/**
 * Middleware kiểm tra quyền truy cập động
 * @param  {...string} allowedRoles - danh sách role được phép
 */
export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role;
  if (!userRole) {
    return res.status(403).json({ status: "ERROR", message: "Không xác định được quyền người dùng" });
  }

  if (allowedRoles.includes(userRole)) {
    next();
  } else {
    return res.status(403).json({
      status: "ERROR",
      message: `Tài khoản của bạn (${userRole}) không có quyền truy cập tài nguyên này`,
    });
  }
};

/**
 * Middleware chỉ cho phép admin truy cập
 */
export const authAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ status: "ERROR", message: "Chỉ admin mới có quyền truy cập" });
};

/**
 * Middleware cho phép admin hoặc chính user đó truy cập
 */
export const authUserOrAdmin = (req, res, next) => {
  const userId = req.params.id;
  if (req.user?.role === "admin" || req.user?._id == userId) return next();
  return res.status(403).json({ status: "ERROR", message: "Bạn không có quyền truy cập tài khoản này" });
};

/**
 * Middleware xác thực cho app (member)
 */
export const authUserApp = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: "ERROR", message: "Token missing" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ status: "ERROR", message: "Token không hợp lệ" });

    req.user = {
      id: decoded.id,
      role: decoded.role || "member",
      isAdmin: decoded.isAdmin || false,
    };
    next();
  });
};


// Kiểm tra => gán req.user và req.userId
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];
  console.log(process.env.ACCESS_TOKEN)
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });

    // gán thông tin user vào request
    req.user = decoded;  // decoded phải có { id, role }
    req.userId = decoded.id; // tiện cho controller
    next();
  });
};

// authenticate → xác thực chung

// authorizeRoles → kiểm tra quyền động

// authAdmin → chỉ admin

// authUserOrAdmin → admin hoặc chính user

// authUserApp → dùng cho member app