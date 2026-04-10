import { Response } from 'express';
import fs from 'fs';
import prisma from '../utils/prisma';
import cloudinary from '../utils/cloudinary';

// Helper để xóa file tạm một cách an toàn (async)
const safeUnlink = async (path: string) => {
  try {
    await fs.promises.unlink(path);
  } catch (_) {}
};

/**
 * Controller quản lý hồ sơ CV (Curriculum Vitae).
 * Lưu trữ file PDF trên Cloudinary.
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
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Kiểm tra CV có tồn tại không và thuộc về user hiện tại
    const cv = await prisma.cV.findFirst({ where: { id, userId } });
    if (!cv) {
      if (req.file) await safeUnlink(req.file.path);
      return res.status(404).json({ message: 'Không tìm thấy CV.' });
    }

    // Kiểm tra file có được upload chưa (qua Multer lưu tạm vào uploads/)
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng đính kèm file PDF.' });
    }

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'cvconnect/cvs',
      resource_type: 'raw',
      public_id: `cv_${userId}_${id}`,
      overwrite: true,
    });

    const pdfUrl = result.secure_url;

    // Lưu URL vào Database
    const updatedCV = await prisma.cV.update({
      where: { id },
      data: { pdfUrl },
    });

    // Xoá file tạm sau khi upload thành công
    await safeUnlink(req.file.path);

    return res.json({
      message: 'Upload PDF thành công!',
      pdfUrl,
      cv: updatedCV,
    });
  } catch (error: any) {
    // Xóa file tạm nếu có lỗi xảy ra
    if (req.file?.path) {
      await safeUnlink(req.file.path);
    }
    console.error('Lỗi khi upload PDF:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống khi xử lý PDF.' });
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
