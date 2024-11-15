import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Agregar al carrito del usuario
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.body.userId;
    const itemId = parseInt(req.body.itemId, 10);

    const userData = await prisma.user.findUnique({ where: { id: userId } });

    if (!userData) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const cartData = (userData.cartData as Record<string, number>) || {};
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: { cartData },
    });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error("Error in addToCart:", error);
    next(error);
  }
};

// Eliminar del carrito del usuario
export const removeFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.body.userId;
    const itemId = req.body.itemId;

    const userData = await prisma.user.findUnique({ where: { id: userId } });

    if (!userData) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const cartData = (userData.cartData as Record<string, number>) || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { cartData },
    });

    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    next(error);
  }
};

// Obtener el carrito del usuario
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.body.userId;

    const userData = await prisma.user.findUnique({ where: { id: userId } });

    if (!userData) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error("Error in getCart:", error);
    next(error);
  }
};
