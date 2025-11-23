import AdminService from "../services/History.js";
import Admin from "../models/Admin.js";

class AdminController {
  // GET /api/admin/config
  static async getConfig(req, res) {
    try {
      const config = await AdminService.getConfig();
      res.status(200).json({
        status: "SUCCESS",
        config,
      });
    } catch (error) {
      res.status(404).json({
        status: "ERROR",
        message: error.message,
      });
    }
  }

  // PUT /api/admin/config
  static async updateConfig(req, res) {
    try {
      const updateData = req.body;
      const updatedConfig = await AdminService.updateConfig(updateData);
      res.status(200).json({
        status: "SUCCESS",
        config: updatedConfig,
      });
    } catch (error) {
      res.status(400).json({
        status: "ERROR",
        message: error.message,
      });
    }
  }

   async createDefaultAdmin() {
        const adminExists = await Admin.findOne();
        if (!adminExists) {
            await Admin.create({
            maxSpinsPerUser: 100,  // số lượt mặc định
            spinEnabled: true,     // bật sự kiện
            startTime: new Date(Date.now() - 1000), // bắt đầu ngay
            endTime: new Date(Date.now() + 24*60*60*1000) // kết thúc sau 24h
        });
        console.log("Default admin created");
    }
  }
}

export default AdminController;
