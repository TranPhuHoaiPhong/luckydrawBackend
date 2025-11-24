import UserService from "../services/User.js"

class UserController {
    async createUser(req, res) {
        try {
            const { fullName, email, password } = req.body 

            if (!fullName || !email || !password) {
                return res.status(400).json({ message: "Missing required fields: fullName, email, password" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }

            const user = await UserService.createUser(req.body)
            res.status(201).json(user)
        } catch (error) {
            if( error.code === 400) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ error: error.message})
        }
    }
    async getAllUsers(req, res) {
        try {
            const result = await UserService.getAllUsers()
            res.status(201).json(result)
        } catch (error) {
            if( error.code === 400) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ error: error.message})
        }
    }
    async getUserById(req, res) {
        try {
            const id = req.params.id
            const result = await UserService.getUserById(id)
            res.status(201).json(result)
        } catch (error) {
            if( error.code === 400) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ error: error.message})
        }
    }
    async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const data = req.body; // dữ liệu gửi lên (fullName, password, ...)
      const file = req.file; // multer sẽ gắn file ở đây nếu upload

      // Gọi service, truyền cả data + file
      const result = await UserService.updateUser(userId, data, file);

      res.status(200).json(result);
    } catch (error) {
      if (error.code === 400) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
    async deleteUser(req, res) {
        try {
            const result = await UserService.updateUser(req.params.id)
            res.status(201).json(result)
        } catch (error) {
            if( error.code === 400) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ error: error.message})
        }
    }
    async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: "ERROR",
          message: "Vui lòng nhập email và mật khẩu",
        });
      }

      // Gọi service login
      const data = await UserService.login({ email, password });
      
      res.cookie("refresh_Token", data.refresh_Token, {
        httpOnly: true,       // không cho client JS đọc
        secure: false,        // true nếu dùng HTTPS
        sameSite: "strict",   // chỉ gửi cookie cùng site
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        path: "/",            // cookie hợp lệ cho toàn site
      });

      return res.status(200).json({
        status: "OK",
        message: "Đăng nhập thành công",
        user: data.user,
        access_Token: data.access_Token,
      });
    } catch (err) {
      const status = err.code || 500;
      return res.status(status).json({
        status: "ERROR",
        message: err.message,
      });
    }
  }
}

export default new UserController