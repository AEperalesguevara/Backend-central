import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-09-30.acacia",
});

// Configuración de variables
const currency = "usd";
const deliveryCharge = 5;
const frontend_URL = "http://localhost:5173";
type Item = {
  name: string;
  price: number;
  quantity: number;
};

const placeOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newOrder = await prisma.order.create({
      data: {
        userId: req.body.userId,
        items: req.body.items,
        amount: req.body.amount,
        address: req.body.address,
      },
    });

    await prisma.user.update({
      where: { id: req.body.userId },
      data: { cartData: {} },
    });

    const line_items = req.body.items.map((item: Item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charge" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder.id}`,
      cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder.id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    next(error);
  }
};

const placeOrderCod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newOrder = await prisma.order.create({
      data: {
        userId: req.body.userId,
        items: req.body.items,
        amount: req.body.amount,
        address: req.body.address,
        payment: true,
      },
    });

    await prisma.user.update({
      where: { id: req.body.userId },
      data: { cartData: {} },
    });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    next(error);
  }
};

const listOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await prisma.order.findMany();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

const userOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.body.userId },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await prisma.order.update({
      where: { id: req.body.orderId },
      data: { status: req.body.status },
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    next(error);
  }
};

const verifyOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await prisma.order.update({
        where: { id: orderId },
        data: { payment: true },
      });
      res.json({ success: true, message: "Paid" });
    } else {
      await prisma.order.delete({
        where: { id: orderId },
      });
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    next(error);
  }
};

export {
  placeOrder,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
  placeOrderCod,
};
