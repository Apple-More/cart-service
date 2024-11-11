import prisma from '../config/prisma';
import { Request, Response, NextFunction } from 'express';

export const getCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cartItems = await prisma.cart_Items.findMany();
    res.status(200).json({
      status: true,
      data: cartItems,
      message: 'Cart items fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};
