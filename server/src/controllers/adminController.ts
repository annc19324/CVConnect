import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Controller dành cho Quản trị viên (Admin).
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

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    return res.json({ message: 'Đã xoá người dùng thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalCVs, totalJobs, totalApplications, usersByRole] = await Promise.all([
      prisma.user.count(),
      prisma.cV.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.user.groupBy({
        by: ['roleId'],
        _count: { id: true }
      })
    ]);

    return res.json({
      stats: {
        totalUsers,
        totalCVs,
        totalJobs,
        totalApplications,
        usersByRole,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

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

export const adminDeleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.job.delete({ where: { id } });
    return res.json({ message: 'Đã xoá tin tuyển dụng thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Admin cập nhật trạng thái tin tuyển dụng (OPEN/CLOSED)
 */
export const adminUpdateJobStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // OPEN hoặc CLOSED

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { status }
    });

    return res.json({ message: 'Cập nhật trạng thái tin thành công.', job: updatedJob });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Lấy tất cả CV trong hệ thống
 */
export const adminGetAllCVs = async (req: Request, res: Response) => {
  try {
    const cvs = await prisma.cV.findMany({
      include: {
        user: { select: { fullName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ cvs });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Xóa CV bất kỳ
 */
export const adminDeleteCV = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cV.delete({ where: { id } });
    return res.json({ message: 'Đã xoá CV thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};
