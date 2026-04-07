import multer from 'multer';
import path from 'path';
import { Request } from 'express';

/**
 * Cấu hình Multer để xử lý upload file PDF từ Client.
 * File sẽ được lưu tạm thời trên máy chủ trước khi upload lên Cloudinary.
 */

// Lưu file tạm vào thư mục 'uploads/'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục tạm, cần tạo thư mục này
  },
  filename: (req: any, file, cb) => {
    // Đặt tên file theo format: userId-timestamp.ext
    const uniqueName = `${req.user?.userId || 'user'}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Bộ lọc chỉ cho phép file PDF
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file PDF!'));
  }
};

// Giới hạn kích thước file tối đa 5MB
export const uploadPDF = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
