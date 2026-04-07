import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Controller dành cho Quản trị viên (Admin).
 * Quản lý người dùng, tin tuyển dụng và xem thống kê hệ thống.
 */

/**
 * Lấy danh sách tất cả người dùng trong hệ thống.
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        roleId: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Thay đổi vai trò (Role) của một người dùng.
 * Ví dụ: Chuyển Candidate thành Recruiter, hoặc ngược lại.
 */
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

    // Tìm role theo tên
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { roleId: role.id },
      include: { role: true },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.json({
      message: `Đã cập nhật vai trò thành "${roleName}" thành công.`,
      user: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Xoá người dùng khỏi hệ thống (Admin only).
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    return res.json({ message: 'Đã xoá người dùng thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Lấy thống kê tổng quan hệ thống (Dashboard Admin).
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    // Đếm song song để tối ưu hiệu suất
    const [totalUsers, totalCVs, totalJobs, totalApplications] = await Promise.all([
      prisma.user.count(),
      prisma.cV.count(),
      prisma.job.count(),
      prisma.application.count(),
    ]);

    return res.json({
      stats: {
        totalUsers,
        totalCVs,
        totalJobs,
        totalApplications,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Admin quản lý tin tuyển dụng - Lấy tất cả các tin.
 */
export const adminGetAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        company: true,
        author: { select: { fullName: true, email: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ jobs });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Admin xoá tin tuyển dụng.
 */
export const adminDeleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.job.delete({ where: { id } });
    return res.json({ message: 'Đã xoá tin tuyển dụng thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};
