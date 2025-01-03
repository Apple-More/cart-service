import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

// prisma
//   .$connect()
//   .then(() => console.log('Connected to database'))
//   .catch((error) => console.error('Database connection error:', error));

export const connectDB = async () => {
  await prisma.$connect();
  console.log('Connected to database');
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log('Disconnected from database');
};

export default prisma;
