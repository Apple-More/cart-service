// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// Get all users
app.get(
  '/api/cart_Items',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.cart_Items.findMany();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },
);

// Create a new user
app.post(
  '/api/user',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { quantity, product_variant_id, customer_id } = req.body;

    if (!quantity || !product_variant_id || !customer_id) {
      return res.status(400).json({
        status: false,
        message: 'Missing required fields: name, email, phoneNumber, gender',
      });
    }

    try {
      const user = await prisma.cart_Items.create({
        data: { quantity, product_variant_id, customer_id },
      });
      res.status(201).json({
        status: true,
        message: 'User Successfully Created',
        data: user,
      });
    } catch (error: any) {
      next(error);
    }
  },
);

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;
