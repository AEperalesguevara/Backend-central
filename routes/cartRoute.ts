import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController';
import authMiddleware from '../middleware/auth';

const cartRouter = express.Router();

cartRouter.post("/get", authMiddleware, getCart);
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);

export default cartRouter;
