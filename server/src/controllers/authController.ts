import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';

/**
 * Controller xử lý tất cả các yêu cầu liên quan đến xác thực (Authentication).
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, roleName } = req.body;

    // 1. Kiểm tra User đã tồn tại hay chưa
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được sử dụng. Vui lòng chọn email khác.' });
    }

    // 2. Tìm ID của Vai trò (Role) dựa trên tên gửi lên (CANDIDATE, RECRUITER, ADMIN)
    const role = await prisma.role.findUnique({ where: { name: roleName || 'CANDIDATE' } });
    if (!role) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
    }

    // 3. Mã hóa Passowrd để bảo mật (Salt round: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo User mới trong Database
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        roleId: role.id,
      },
      include: {
        role: true, // Bao gồm thông tin role trong kết quả trả về
      },
    });

    // 5. Trả về thông báo thành công (Không gửi password về client vì lý do bảo mật)
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      message: 'Đăng ký tài khoản thành công.',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Lỗi khi đăng ký:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống. Vui lòng thử lại sau.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm User qua Email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // 2. So sánh Password nhập vào với Password đã mã hóa trong DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // 3. Tạo AccessToken
    const token = generateToken({
      userId: user.id,
      roleName: user.role.name,
    });

    // 4. Trả về kết quả đăng nhập (User info + Token)
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

/**
 * Lấy thông tin User hiện tại từ Token. 
 * (Thường được sử dụng sau khi trang React được reload).
 */
export const getMe = async (req: any, res: Response) => {
  try {
    // req.user sẽ được truyền vào từ Auth Middleware (sẽ viết ở bước sau)
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
