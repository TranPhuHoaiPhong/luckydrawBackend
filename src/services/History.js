import Admin from "../models/Admin.js";

class AdminService {
  /**
   * Lấy config admin hiện tại
   */
  static async getConfig() {
    const config = await Admin.findOne().sort({ createdAt: -1 }); // lấy config mới nhất
    if (!config) throw new Error("Chưa có config admin nào");
    return config;
  }

  /**
   * Cập nhật config admin
   * @param {Object} updateData - các trường cần update
   */
  static async updateConfig(updateData) {
    const config = await Admin.findOne().sort({ createdAt: -1 });
    if (!config) {
      // Nếu chưa có config, tạo mới
      const newConfig = await Admin.create(updateData);
      return newConfig;
    }

    // Cập nhật các trường được gửi
    Object.keys(updateData).forEach((key) => {
      config[key] = updateData[key];
    });

    await config.save();
    return config;
  }
}

export default AdminService;
