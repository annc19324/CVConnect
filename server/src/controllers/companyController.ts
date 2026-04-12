import { Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Controller quản lý thông tin Công ty (Company Profiling).
 */
export const updateCompany = async (req: any, res: Response) => {
  try {
    const { name, description, logoUrl, location, website } = req.body;
    const recruiterId = req.user.userId;

    // 1. Kiểm tra Công ty đã có sẵn hay chưa
    const existingCompany = await prisma.company.findUnique({
      where: { recruiterId },
    });

    if (existingCompany) {
      // 2. Nếu đã có, thì cập nhật (Update)
      const updated = await prisma.company.update({
        where: { id: existingCompany.id },
        data: { name, description, logoUrl, location, website },
      });
      return res.json({ message: 'Cập nhật công ty thành công.', company: updated });
    } else {
      // 3. Nếu chưa có, thì tạo mới (Create) - Gắn link với Recruiter qua recruiterId
      const created = await prisma.company.create({
        data: { name, description, logoUrl, location, website, recruiterId },
      });
      return res.status(201).json({ message: 'Tạo công ty thành công.', company: created });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật công ty:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Lấy thông tin công ty của Nhà tuyển dụng hiện tại
 */
export const getMyCompany = async (req: any, res: Response) => {
  try {
    const company = await prisma.company.findUnique({
      where: { recruiterId: req.user.userId },
    });
    return res.json({ company });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};
