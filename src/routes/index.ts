import { Router } from 'express';
import {
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getCartItemsByUser,
} from '../controllers/cart-controller';

const router = Router();

router.post('/cart-items', createCartItem);
router.put('/cart-items/:cart_item_id', updateCartItem);
router.delete('/cart-items/:cart_item_id', deleteCartItem);
router.get('/customer/:customer_id/cart-items', getCartItemsByUser);

export default router;
