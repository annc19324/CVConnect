import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload một file cục bộ lên Cloudinary
 * @param filePath Đường dẫn tệp cục bộ
 * @param folder Thư mục lưu trên Cloudinary (vd: 'cvconnect/avatars')
 */
export const uploadToCloudinary = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', // Tự động nhận diện ảnh/tài liệu/pdf
    });

    // Sau khi upload thành công, xóa tệp cục bộ để giải phóng bộ nhớ
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('❌ Lỗi Upload Cloudinary:', error);
    // Vẫn xóa file cục bộ nếu upload lỗi để tránh rác server
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

export default cloudinary;
