import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

/**
 * Middleware để xác thực người dùng dựa trên JWT trong Header (Authorization: Bearer <token>)
 */
export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Kiểm tra header Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }

  // 2. Lấy Token từ header
  const token = authHeader.split(' ')[1];

  // 3. Giải mã token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Token không hợp lệ. Vui lòng đăng nhập lại.' });
  }

  // 4. Lưu thông tin User đã giải mã vào req để sử dụng ở các Controller tiếp theo
  req.user = decoded;
  next();
};

/**
 * Middleware chỉ cho phép người dùng có các Vai trò (Roles) cụ thể truy cập.
 */
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    // req.user được gán từ authMiddleware phía trước
    if (!req.user || !allowedRoles.includes(req.user.roleName)) {
      return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này.' });
    }
    next();
  };
};
