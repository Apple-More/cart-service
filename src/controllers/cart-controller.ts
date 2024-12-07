import prisma from '../config/prisma';
import { Request, Response } from 'express';
import { fetchProductVariantDetails } from '../utils/axios';

export const createCartItem = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { quantity, product_variant_id, customer_id } = req.body;

    const cart = await prisma.cart_Items.create({
      data: {
        quantity,
        product_variant_id,
        customer_id,
      },
    });

    return res.status(201).json({
      status: 'success',
      data: cart,
      message: 'Cart item created successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Error creating cart item. Error: ' + error.message,
    });
  }
};

export const getCartItems = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const cartItems = await prisma.cart_Items.findMany();
    return res.status(200).json({
      status: true,
      data: cartItems,
      message: 'Cart items fetched successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Error fetching cart items. Error: ' + error.message,
    });
  }
};

export const getCartItemsByUser = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { customer_id } = req.params;

    const cartItems = await prisma.cart_Items.findMany({
      where: {
        customer_id: customer_id,
      },
    });

    const cartItemDetails = await Promise.all(
      cartItems.map(async (cartItem) => {
        const variantDetails = await fetchProductVariantDetails(
          cartItem.product_variant_id,
        );
        // console.log('variantDetails', variantDetails);
        return {
          ...cartItem,
          variantDetails,
        };
      }),
    );

    return res.status(200).json({
      status: true,
      data: cartItemDetails,
      message: 'Cart items fetched successfully for user',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Error fetching cart items for user. Error: ' + error.message,
    });
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const cart_item_id = req.params.cart_item_id;
    const { quantity } = req.body;
    const cart_Item = await prisma.cart_Items.update({
      where: { cart_item_id },
      data: {
        quantity,
      },
    });
    return res.status(200).json({
      status: true,
      data: cart_Item,
      message: 'Cart item updated successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      data: null,
      message: `Error updating cart item: ${error.message}`,
    });
  }
};

export const deleteCartItem = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { cart_item_id } = req.params;

  try {
    await prisma.cart_Items.delete({
      where: { cart_item_id },
    });

    return res.status(200).json({
      status: true,
      data: [],
      message: 'Cart item deleted successfully',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      data: null,
      message: 'Error deleting cart item. Error: ' + error.message,
    });
  }
};
