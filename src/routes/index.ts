import { Router } from 'express';
import { getCartItems } from '../controllers/cart-controller';

const router = Router();

router.get('/', getCartItems);

export default router;
