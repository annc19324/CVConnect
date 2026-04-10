/**
 * Định nghĩa các kiểu dữ liệu (TypeScript Interfaces) dùng chung trong Frontend.
 * Tất cả đều phản ánh chính xác cấu trúc dữ liệu từ Prisma Schema.
 */

// Vai trò người dùng
export interface Role {
  id: number;
  name: string; // 'CANDIDATE' | 'RECRUITER' | 'ADMIN'
}

// Thông tin người dùng
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar: string | null;
  role: Role;
  company?: Company | null;
  createdAt: string;
}

// Hồ sơ CV
export interface CV {
  id: string;
  userId: string;
  title: string;
  template: string;
  data: CVData;        // Dữ liệu JSON chứa nội dung CV
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Cấu trúc dữ liệu bên trong một CV
export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;    // Tóm tắt bản thân
    avatarUrl?: string;
  };
  education: Array<{
    school: string;
    degree: string;
    field: string;       // Chuyên ngành
    startDate: string;
    endDate: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];      // Danh sách kỹ năng
  languages?: string[];  // Ngôn ngữ (Tùy chọn)
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

// Thông tin Công ty
export interface Company {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  recruiterId: string;
}

// Tin tuyển dụng
export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: any;     // JSON linh hoạt
  salary: string | null;
  location: string;
  company: Company;
  postedBy: string;       // ID của nhà tuyển dụng đã đăng tin
  requireCV: boolean;     // ← Tính năng quan trọng
  status: string;         // 'OPEN' | 'CLOSED'
  deadline: string | null;
  createdAt: string;
  _count?: { applications: number };
}

// Đơn ứng tuyển
export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  cvId: string | null;
  status: string;        // 'PENDING' | 'ACCEPTED' | 'REJECTED'
  coverLetter: string | null;
  appliedDate: string;
  job?: Job;
  candidate?: Partial<User>;
  cv?: Partial<CV> | null;
}

// Tin nhắn
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  applicationId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: Partial<User>;
}
