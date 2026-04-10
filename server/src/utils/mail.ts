import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Tạo transporter dùng cho việc gửi mail qua Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password (16 ký tự viết liền)
  },
});

/**
 * Hàm hỗ trợ gửi Email.
 * @param to Địa chỉ người nhận
 * @param subject Tiêu đề thư
 * @param html Nội dung thư dạng HTML
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"CVConnect Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Lỗi khi gửi mail:', error);
    return false;
  }
};
