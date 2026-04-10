import { Request, Response } from 'express';
import prisma from '../utils/prisma';

/**
 * Controller xử lý các tin tuyển dụng (Jobs).
 */
export const createJob = async (req: any, res: Response) => {
  try {
    const { 
      title, 
      description, 
      requirements, 
      salary, 
      location, 
      deadline, 
      requireCV 
    } = req.body;

    const recruiterId = req.user.userId;

    // 1. Kiểm tra xem Nhà tuyển dụng đã có Công ty chưa
    const company = await prisma.company.findUnique({
      where: { recruiterId },
    });

    if (!company) {
      return res.status(400).json({ 
        message: 'Bạn phải cập nhật thông tin công ty trước khi đăng tin tuyển dụng.' 
      });
    }

    // 2. Tạo tin tuyển dụng mới
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        requirements: requirements || {}, // Có thể là JSON array hoặc object
        salary,
        location,
        deadline: deadline ? new Date(deadline) : null,
        companyId: company.id,
        postedBy: recruiterId,
        requireCV: requireCV !== undefined ? requireCV : true, // Tận dụng field requireCV
        status: 'OPEN',
      },
    });

    return res.status(201).json({
      message: 'Đăng tin tuyển dụng thành công.',
      job: newJob,
    });
  } catch (error: any) {
    console.error('Lỗi khi tạo tin tuyển dụng:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống khi đăng tin.' });
  }
};

/**
 * Lấy tất cả tin tuyển dụng công khai cho Ứng viên (Candidate)
 */
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { keyword, location } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        status: 'OPEN',
        ...(keyword ? {
          title: { contains: keyword as string, mode: 'insensitive' }
        } : {}),
        ...(location ? {
          location: { contains: location as string, mode: 'insensitive' }
        } : {})
      },
      include: {
        company: true, // Bao gồm thông tin công ty để hiển thị Logo
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ jobs });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi tải danh sách tin.' });
  }
};

/**
 * Lấy chi tiết tin tuyển dụng theo ID
 */
export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        author: {
          select: { fullName: true, email: true, avatar: true }
        }
      },
    });

    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng.' });
    }

    return res.json({ job });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi tải chi tiết tin.' });
  }
};

/**
 * Lấy danh sách tin đã đăng của riêng Nhà tuyển dụng hiện tại
 */
export const getRecruiterJobs = async (req: any, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { postedBy: req.user.userId },
      include: {
        _count: {
          select: { applications: true } // Đếm số đơn ứng tuyển cho mỗi job
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ jobs });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};
