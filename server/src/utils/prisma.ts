import { PrismaClient } from '@prisma/client';

/**
 * Singleton cho Prisma Client. 
 * Giúp quản lý kết nối Database PostgreSQL một cách hiệu quả.
 */
const prisma = new PrismaClient();

export default prisma;
