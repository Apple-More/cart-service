import {
    createCartItem,
    getCartItems,
    getCartItemsByUser,
    updateCartItem,
    deleteCartItem,
  } from '../../src/controllers/cart-controller';
  import { Request, Response } from 'express';
  import { PrismaClient } from '@prisma/client';
  import prisma, { connectDB, disconnectDB } from '../../src/config/prisma';

  
  // Mock PrismaClient
  jest.mock('@prisma/client', () => {
    const mockCartItems = {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  
    return {
      PrismaClient: jest.fn().mockImplementation(() => ({
        cart_Items: mockCartItems,
        $connect: jest.fn().mockResolvedValue(undefined), // Mock $connect
      })),
    };
  });
  
  const mockResponse = (): Partial<Response> => {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  
  const mockRequest = (body: any = {}, params: any = {}): Partial<Request> => {
    const req = {} as Partial<Request>;
    req.body = body;
    req.params = params;
    return req;
  };
  
  describe('Cart Controller Tests', () => {
    let prismaClient: any;
  
    beforeAll(() => {
      prismaClient = new PrismaClient(); // Mocked Prisma client
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    // Test: createCartItem
    describe('createCartItem', () => {
      it('should create a new cart item successfully', async () => {
        const req = mockRequest({
          quantity: 2,
          product_variant_id: 'prod-123',
          customer_id: 'cust-456',
        });
        const res = mockResponse();
  
        prismaClient.cart_Items.create.mockResolvedValue({
          cart_item_id: 'cart-789',
          quantity: 2,
          product_variant_id: 'prod-123',
          customer_id: 'cust-456',
        });
  
        await createCartItem(req as Request, res as Response, jest.fn());
  
        expect(prismaClient.cart_Items.create).toHaveBeenCalledWith({
          data: {
            quantity: 2,
            product_variant_id: 'prod-123',
            customer_id: 'cust-456',
          },
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            cart_item_id: 'cart-789',
            quantity: 2,
            product_variant_id: 'prod-123',
            customer_id: 'cust-456',
          },
          message: 'Cart item created successfully',
        });
      });
    });
  
    // Test: getCartItems
    describe('getCartItems', () => {
      it('should fetch all cart items', async () => {
        const req = mockRequest();
        const res = mockResponse();
  
        prismaClient.cart_Items.findMany.mockResolvedValue([
          { cart_item_id: 'cart-1', quantity: 1, product_variant_id: 'prod-1', customer_id: 'cust-1' },
          { cart_item_id: 'cart-2', quantity: 2, product_variant_id: 'prod-2', customer_id: 'cust-2' },
        ]);
  
        await getCartItems(req as Request, res as Response, jest.fn());
  
        expect(prismaClient.cart_Items.findMany).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          status: true,
          data: [
            { cart_item_id: 'cart-1', quantity: 1, product_variant_id: 'prod-1', customer_id: 'cust-1' },
            { cart_item_id: 'cart-2', quantity: 2, product_variant_id: 'prod-2', customer_id: 'cust-2' },
          ],
          message: 'Cart items fetched successfully',
        });
      });
    });
  
    // Test: getCartItemsByUser
    describe('getCartItemsByUser', () => {
      it('should fetch cart items for a specific user', async () => {
        const req = mockRequest({}, { customer_id: 'cust-1' });
        const res = mockResponse();
  
        prismaClient.cart_Items.findMany.mockResolvedValue([
          { cart_item_id: 'cart-1', quantity: 1, product_variant_id: 'prod-1', customer_id: 'cust-1' },
        ]);
  
        await getCartItemsByUser(req as Request, res as Response, jest.fn());
  
        expect(prismaClient.cart_Items.findMany).toHaveBeenCalledWith({
          where: { customer_id: 'cust-1' },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          status: true,
          data: [
            { cart_item_id: 'cart-1', quantity: 1, product_variant_id: 'prod-1', customer_id: 'cust-1' },
          ],
          message: 'Cart items fetched successfully for user',
        });
      });
    });
  
    // Test: updateCartItem
    describe('updateCartItem', () => {
      it('should update a cart item successfully', async () => {
        const req = mockRequest({ quantity: 3 }, { cart_item_id: 'cart-123' });
        const res = mockResponse();
  
        prismaClient.cart_Items.update.mockResolvedValue({
          cart_item_id: 'cart-123',
          quantity: 3,
          product_variant_id: 'prod-123',
          customer_id: 'cust-456',
        });
  
        await updateCartItem(req as Request, res as Response);
  
        expect(prismaClient.cart_Items.update).toHaveBeenCalledWith({
          where: { cart_item_id: 'cart-123' },
          data: { quantity: 3 },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          status: true,
          data: {
            cart_item_id: 'cart-123',
            quantity: 3,
            product_variant_id: 'prod-123',
            customer_id: 'cust-456',
          },
          message: 'Cart item updated successfully',
        });
      });

      it('should handle errors when updating a cart item', async () => {
        const mockError = new Error('Database connection failed');
    
        (prisma.cart_Items.update as jest.Mock).mockRejectedValue(mockError);
    
        const req = mockRequest({ quantity: 3 }, { cart_item_id: 'cart-123' });
        const res = mockResponse();
    
        await updateCartItem(req as Request, res as Response);
    
        expect(prisma.cart_Items.update).toHaveBeenCalledWith({
          where: { cart_item_id: 'cart-123' },
          data: { quantity: 3 },
        });
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          status: false,
          data: null,
          message: `Error updating cart item: ${mockError.message}`,
        });
      });
    });
  
    // Test: deleteCartItem
    describe('deleteCartItem', () => {
      it('should delete a cart item successfully', async () => {
        const req = mockRequest({}, { cart_item_id: 'cart-123' });
        const res = mockResponse();
  
        prismaClient.cart_Items.delete.mockResolvedValue({});
  
        await deleteCartItem(req as Request, res as Response, jest.fn());
  
        expect(prismaClient.cart_Items.delete).toHaveBeenCalledWith({
          where: { cart_item_id: 'cart-123' },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          status: true,
          data: [],
          message: 'Cart item deleted successfully',
        });
      });
    });
  });
  