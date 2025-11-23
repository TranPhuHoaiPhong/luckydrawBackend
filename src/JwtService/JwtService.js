import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Sinh access token (thời hạn ngắn)
export const genneralAccessToken = (payload) => {
  const access_Token = jwt.sign(
    {
      ...payload, // payload chứa id, role
    },
    process.env.ACCESS_TOKEN, // chú ý: sửa lỗi chính tả "ACCCESS_TOKEN" → "ACCESS_TOKEN"
    { expiresIn: "1000s" }
  );
  return access_Token;
};

// Sinh refresh token (thời hạn dài)
export const genneralRefreshToken = (payload) => {
  const refresh_Token = jwt.sign(
    {
      ...payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );
  return refresh_Token;
};

// Hàm làm mới access token
export const refreshTokenJwtService = async (token) => {
  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN);

    const access_Token = genneralAccessToken({
      id: user?.id,
      role: user?.role,
    });

    return {
      status: "OK",
      message: "Lấy token thành công",
      access_Token,
    };
  } catch (err) {
    console.error("Lỗi verify refresh token:", err);
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
};
