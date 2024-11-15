import { Router } from 'express';
import {
  getCartItems,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} from '../controllers/cart-controller';

const router = Router();

router.get('/', getCartItems);
router.post('/', createCartItem);
router.put('/:cart_item_id', updateCartItem);
router.delete('/:cart_item_id', deleteCartItem);

export default router;
