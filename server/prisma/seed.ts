import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Đang khởi tạo dữ liệu mẫu (Seed) ---');

  // 1. Tạo các Vai trò (Roles)
  const roleNames = ['CANDIDATE', 'RECRUITER', 'ADMIN'];

  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✓ Đã khởi tạo các vai trò.');

  // Lấy lại danh sách vai trò để lấy ID chính xác
  const roles = await prisma.role.findMany();
  const getRoleId = (name: string) => roles.find((r) => r.name === name)?.id || 1;

  // 2. Tạo tài khoản mẫu
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Tài khoản Candidate
  await prisma.user.upsert({
    where: { email: 'candidate@example.com' },
    update: { roleId: getRoleId('CANDIDATE') },
    create: {
      email: 'candidate@example.com',
      password: hashedPassword,
      fullName: 'Nguyễn Văn Ứng Viên',
      roleId: getRoleId('CANDIDATE'),
    },
  });

  // Tài khoản Recruiter
  await prisma.user.upsert({
    where: { email: 'recruiter@example.com' },
    update: { roleId: getRoleId('RECRUITER') },
    create: {
      email: 'recruiter@example.com',
      password: hashedPassword,
      fullName: 'Trần Nhà Tuyển Dụng',
      roleId: getRoleId('RECRUITER'),
    },
  });

  // Tài khoản Admin
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { roleId: getRoleId('ADMIN') },
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      fullName: 'Hệ Thống Admin',
      roleId: getRoleId('ADMIN'),
    },
  });

  console.log('✓ Đã tạo các tài khoản mặc định (MK: 123456):');
  console.log(`  - candidate@example.com (Role ID: ${getRoleId('CANDIDATE')})`);
  console.log(`  - recruiter@example.com (Role ID: ${getRoleId('RECRUITER')})`);
  console.log(`  - admin@example.com (Role ID: ${getRoleId('ADMIN')})`);

  console.log('--- Seed hoàn tất ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
