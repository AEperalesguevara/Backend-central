import express from 'express';
import authMiddleware from "../middleware/auth";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, placeOrderCod } from '../controllers/orderController';

const orderRouter = express.Router();

// Las funciones en los controladores deben ajustarse para no retornar un valor o retornar `void`
orderRouter.get("/list", listOrders); // Debe retornar `void`
orderRouter.post("/userorders", authMiddleware, userOrders); // Debe retornar `void`
orderRouter.post("/place", authMiddleware, placeOrder); // Debe retornar `void`
orderRouter.post("/status", updateStatus); // Debe retornar `void`
orderRouter.post("/verify", verifyOrder); // Debe retornar `void`
orderRouter.post("/placecod", authMiddleware, placeOrderCod); // Debe retornar `void`

export default orderRouter;
