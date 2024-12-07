import { Router } from 'express';
import {
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getCartItemsByUser,
} from '../controllers/cart-controller';
import allowRoles from '../middlewares/allow-roles';

const router = Router();

router.post('/cart-items', allowRoles('Customer'), createCartItem);
router.put('/cart-items/:cart_item_id', allowRoles('Customer'), updateCartItem);
router.delete(
  '/cart-items/:cart_item_id',
  allowRoles('Customer'),
  deleteCartItem,
);
router.get(
  '/customer/:customer_id/cart-items',
  allowRoles('Customer'),
  getCartItemsByUser,
);

export default router;
