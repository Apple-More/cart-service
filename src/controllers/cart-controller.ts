import prisma from '../config/prisma';
import { Request, Response, NextFunction } from 'express';
import { fetchProductVariantDetails } from '../utils/axios';

export const createCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { quantity, product_variant_id, customer_id } = req.body;

    const cart = await prisma.cart_Items.create({
      data: {
        quantity,
        product_variant_id,
        customer_id,
      },
    });

    res.status(201).json({
      status: 'success',
      data: cart,
      message: 'Cart item created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getCartItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

export const getCartItemsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { customer_id } = req.params;

    const cartItems = await prisma.cart_Items.findMany({
      where: {
        customer_id: customer_id,
      },
    });
   
    const cartItemDetails = await Promise.all(
      cartItems.map(async(cartItem)=>{
        const variantDetails = await fetchProductVariantDetails(cartItem.product_variant_id);
        // console.log('variantDetails', variantDetails);
        return {
          ...cartItem, 
          variantDetails, 
        };
      })
    )

    res.status(200).json({
      status: true,
      data: cartItemDetails,
      message: 'Cart items fetched successfully for user',
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cart_item_id = req.params.cart_item_id;
    const { quantity } = req.body;
    const cart_Item = await prisma.cart_Items.update({
      where: { cart_item_id },
      data: {
        quantity,
      },
    });
    res.status(200).json({
      status: true,
      data: cart_Item,
      message: 'Cart item updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      data: null,
      message: `Error updating cart item: ${error.message}`,
    });
  }
};

export const deleteCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { cart_item_id } = req.params;

  try {
    await prisma.cart_Items.delete({
      where: { cart_item_id },
    });

    res.status(200).json({
      status: true,
      data: [],
      message: 'Cart item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
