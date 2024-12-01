import { PrismaClient } from '@prisma/client';

// Mock the entire PrismaClient with jest.fn() for methods
const prisma = {
  cart_Items: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
} as unknown as PrismaClient; // Typecast it as PrismaClient

export default prisma;