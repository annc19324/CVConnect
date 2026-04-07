import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cvconnect_secret_key_123';

/**
 * Tạo Accesstoken cho User sau khi đăng nhập thành công.
 * @param payload - Dữ liệu cần mã hóa (thường là userId và roleId)
 * @returns string - Chuỗi token JWT
 */
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token hết hạn sau 7 ngày
  });
};

/**
 * Giải mã và xác thực token JWT gửi lên từ phía Client.
 * @param token - Chuỗi JWT token
 * @returns any - Dữ liệu đã giải mã từ token
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
