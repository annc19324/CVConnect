import { Response } from 'express';
import prisma from '../utils/prisma';
import { io } from '../index'; // Socket.io instance để gửi thông báo realtime

/**
 * Controller xử lý đơn ứng tuyển (Application).
 */

/**
 * Nộp đơn ứng tuyển vào một vị trí.
 * -----------------------------------------------------------------
 * LOGIC QUAN TRỌNG - requireCV:
 *   - Nếu job.requireCV = true  → cv_id BẮT BUỘC phải có trong body
 *   - Nếu job.requireCV = false → cv_id có thể để trống (null)
 * -----------------------------------------------------------------
 */
export const applyJob = async (req: any, res: Response) => {
  try {
    const { jobId, cvId, coverLetter } = req.body;
    const candidateId = req.user.userId;

    // 1. Lấy thông tin tin tuyển dụng, bao gồm trường requireCV
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return res.status(404).json({ message: 'Không tìm thấy tin tuyển dụng.' });
    }

    // 2. Kiểm tra tin tuyển dụng có còn mở không
    if (job.status === 'CLOSED') {
      return res.status(400).json({ message: 'Tin tuyển dụng này đã đóng, không thể nộp đơn.' });
    }

    // 3. Kiểm tra đã nộp đơn chưa (tránh nộp trùng)
    const existingApp = await prisma.application.findFirst({
      where: { jobId, candidateId },
    });
    if (existingApp) {
      return res.status(400).json({ message: 'Bạn đã nộp đơn vào vị trí này rồi.' });
    }

    // =========================================================
    // 4. LOGIC KIỂM TRA requireCV - Đây là tính năng mới quan trọng
    // =========================================================
    if (job.requireCV && !cvId) {
      // Nếu công việc yêu cầu CV nhưng ứng viên không đính kèm
      return res.status(400).json({
        message: 'Vị trí này yêu cầu đính kèm CV. Vui lòng chọn CV từ hồ sơ của bạn.',
      });
    }

    // 5. Nếu có cvId, kiểm tra CV có thuộc về ứng viên này không
    if (cvId) {
      const cv = await prisma.cV.findFirst({ where: { id: cvId, userId: candidateId } });
      if (!cv) {
        return res.status(400).json({ message: 'CV không hợp lệ hoặc không thuộc về bạn.' });
      }
    }

    // 6. Tạo đơn ứng tuyển mới
    const newApplication = await prisma.application.create({
      data: {
        jobId,
        candidateId,
        cvId: cvId || null, // null nếu không yêu cầu CV
        coverLetter,
        status: 'PENDING',
      },
      include: {
        candidate: { select: { fullName: true, email: true } },
        job: { select: { title: true, postedBy: true } },
      },
    });

    // 7. Gửi thông báo realtime cho Nhà tuyển dụng qua Socket.io
    io.emit(`notification_recruiter_${newApplication.job.postedBy}`, {
      type: 'NEW_APPLICATION',
      message: `${newApplication.candidate.fullName} vừa nộp đơn vào vị trí "${newApplication.job.title}".`,
      applicationId: newApplication.id,
    });

    return res.status(201).json({
      message: 'Nộp đơn ứng tuyển thành công!',
      application: newApplication,
    });
  } catch (error: any) {
    console.error('Lỗi khi nộp đơn:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống khi nộp đơn.' });
  }
};

/**
 * Recruiter: Lấy danh sách đơn ứng tuyển cho tất cả các tin của mình.
 */
export const getApplicationsForRecruiter = async (req: any, res: Response) => {
  try {
    const { jobId } = req.query; // Có thể lọc theo jobId cụ thể

    const applications = await prisma.application.findMany({
      where: {
        job: { postedBy: req.user.userId }, // Chỉ lấy đơn từ job của mình
        ...(jobId ? { jobId: jobId as string } : {}),
      },
      include: {
        candidate: { select: { fullName: true, email: true, avatar: true } },
        cv: { select: { id: true, title: true, pdfUrl: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { appliedDate: 'desc' },
    });

    return res.json({ applications });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Candidate: Lấy danh sách đơn ứng tuyển của bản thân.
 */
export const getMyApplications = async (req: any, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      where: { candidateId: req.user.userId },
      include: {
        job: {
          include: { company: true },
        },
        cv: { select: { title: true } },
      },
      orderBy: { appliedDate: 'desc' },
    });
    return res.json({ applications });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Recruiter: Cập nhật trạng thái đơn ứng tuyển (Chấp nhận / Từ chối).
 */
export const updateApplicationStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACCEPTED' hoặc 'REJECTED'

    // Kiểm tra Status hợp lệ
    if (!['ACCEPTED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
    }

    // Kiểm tra đơn có thuộc về job của Recruiter này không
    const application = await prisma.application.findFirst({
      where: { id, job: { postedBy: req.user.userId } },
      include: {
        candidate: { select: { fullName: true } },
        job: { select: { title: true } },
      },
    });

    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy đơn ứng tuyển.' });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    // Gửi thông báo realtime cho Ứng viên
    io.emit(`notification_candidate_${application.candidateId}`, {
      type: status === 'ACCEPTED' ? 'APPLICATION_ACCEPTED' : 'APPLICATION_REJECTED',
      message: status === 'ACCEPTED'
        ? `🎉 Chúc mừng! Đơn ứng tuyển vào "${application.job.title}" của bạn đã được chấp nhận.`
        : `Đơn ứng tuyển vào "${application.job.title}" của bạn chưa được chọn lần này.`,
      applicationId: id,
    });

    return res.json({ message: `Đã cập nhật trạng thái thành "${status}".`, application: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};
