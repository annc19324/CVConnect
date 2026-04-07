import { Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '../utils/prisma';

/**
 * Cấu hình Cloudinary để lưu trữ file PDF lên đám mây.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Controller quản lý hồ sơ CV (Curriculum Vitae).
 */

/**
 * Tạo CV mới (Lưu dữ liệu dạng JSON vào DB).
 * Ứng viên điền form CV Builder, data được lưu dưới dạng JSON.
 */
export const createCV = async (req: any, res: Response) => {
  try {
    const { title, template, data } = req.body;
    const userId = req.user.userId;

    const newCV = await prisma.cV.create({
      data: {
        userId,
        title,
        template: template || 'default',
        data, // Object JSON chứa thông tin CV (học vấn, kinh nghiệm, kỹ năng...)
      },
    });

    return res.status(201).json({
      message: 'Tạo CV thành công.',
      cv: newCV,
    });
  } catch (error: any) {
    console.error('Lỗi khi tạo CV:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống khi tạo CV.' });
  }
};

/**
 * Cập nhật thông tin CV đã có.
 */
export const updateCV = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, template, data } = req.body;
    const userId = req.user.userId;

    // Kiểm tra CV có thuộc về người dùng hiện tại không
    const cv = await prisma.cV.findFirst({ where: { id, userId } });
    if (!cv) {
      return res.status(404).json({ message: 'Không tìm thấy CV hoặc bạn không có quyền chỉnh sửa.' });
    }

    const updated = await prisma.cV.update({
      where: { id },
      data: { title, template, data, updatedAt: new Date() },
    });

    return res.json({ message: 'Cập nhật CV thành công.', cv: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Lấy danh sách CV của Ứng viên đang đăng nhập.
 */
export const getMyCVs = async (req: any, res: Response) => {
  try {
    const cvs = await prisma.cV.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ cvs });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Lấy chi tiết một CV theo ID (dành cho Recruiter xem hoặc Candidate tự xem).
 */
export const getCVById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const cv = await prisma.cV.findUnique({
      where: { id },
      include: { user: { select: { fullName: true, email: true, avatar: true } } },
    });

    if (!cv) {
      return res.status(404).json({ message: 'Không tìm thấy CV.' });
    }
    return res.json({ cv });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Upload file PDF lên Cloudinary và lưu URL vào bảng cvs.
 * @route POST /api/cvs/:id/upload-pdf
 * Body sẽ chứa file PDF (xử lý qua Multer middleware)
 */
export const uploadCVPdf = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Kiểm tra CV có tồn tại không
    const cv = await prisma.cV.findFirst({ where: { id, userId } });
    if (!cv) {
      return res.status(404).json({ message: 'Không tìm thấy CV.' });
    }

    // Kiểm tra file có được upload chưa (qua Multer)
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng đính kèm file PDF.' });
    }

    // Upload file PDF lên Cloudinary (resource_type: 'raw' cho file không phải ảnh)
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',             // Quan trọng: 'raw' để upload file PDF
      folder: 'cvconnect/cvs',          // Thư mục lưu trữ trên Cloudinary
      public_id: `cv_${userId}_${id}`,  // Tên file trên Cloudinary
      format: 'pdf',
    });

    // Lưu URL của file PDF vào DB
    const updatedCV = await prisma.cV.update({
      where: { id },
      data: { pdfUrl: uploadResult.secure_url },
    });

    return res.json({
      message: 'Upload PDF thành công.',
      pdfUrl: uploadResult.secure_url,
      cv: updatedCV,
    });
  } catch (error: any) {
    console.error('Lỗi khi upload PDF:', error);
    return res.status(500).json({ message: 'Lỗi khi upload file lên Cloudinary.' });
  }
};

/**
 * Xoá CV của người dùng.
 */
export const deleteCV = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const cv = await prisma.cV.findFirst({ where: { id, userId } });
    if (!cv) {
      return res.status(404).json({ message: 'Không tìm thấy CV.' });
    }

    await prisma.cV.delete({ where: { id } });
    return res.json({ message: 'Đã xoá CV thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};
