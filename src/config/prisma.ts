import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => console.log('Connected to database'))
  .catch((error) => console.error('Database connection error:', error));

export default prisma;
