import { Router } from 'express';
import {
  getCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  getCartItemsByUser
} from '../controllers/cart-controller';

const router = Router();

router.get('/', getCartItems);
router.post('/', createCartItem);
router.put('/:cart_item_id', updateCartItem);
router.delete('/:cart_item_id', deleteCartItem);
router.get('/customer/:customer_id', getCartItemsByUser);

export default router;
