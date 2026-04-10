import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';
import { sendEmail } from '../utils/mail';

/**
 * Controller xử lý tất cả các yêu cầu liên quan đến xác thực (Authentication).
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, roleName } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được sử dụng.' });
    }

    const role = await prisma.role.findUnique({ where: { name: roleName || 'CANDIDATE' } });
    if (!role) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công.',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Lỗi khi đăng ký:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    const token = generateToken({
      userId: user.id,
      roleName: user.role.name,
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.json({
      message: 'Đăng nhập thành công.',
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    console.error('Lỗi khi đăng nhập:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { role: true, company: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Đổi mật khẩu (Dành cho người dùng đã đăng nhập)
 */
export const changePassword = async (req: any, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại.' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return res.json({ message: 'Đổi mật khẩu thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Quên mật khẩu: Gửi email reset
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Email không tồn tại trong hệ thống.' });

    // Tạo token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // Hết hạn sau 1 tiếng

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry: expiry }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2>Khôi phục mật khẩu CVConnect</h2>
        <p>Xin chào ${user.fullName},</p>
        <p>Bạn đã yêu cầu khôi phục mật khẩu. Vui lòng click vào nút bên dưới để đặt lại mật khẩu của mình. Liên kết này sẽ hết hạn sau 1 giờ.</p>
        <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Đặt lại mật khẩu</a>
        <p>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>
      </div>
    `;

    await sendEmail(email, 'Khôi phục mật khẩu CVConnect', htmlContent);

    return res.json({ message: 'Yêu cầu của bạn đã được gửi. Vui lòng kiểm tra email.' });
  } catch (error) {
    console.error('Forgot PW Error:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};

/**
 * Đặt lại mật khẩu (Dùng Token từ email)
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return res.json({ message: 'Mật khẩu của bạn đã được cập nhật thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống.' });
  }
};
