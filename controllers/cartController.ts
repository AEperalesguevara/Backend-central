import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Agregar al carrito del usuario
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
      const userId = req.body.userId;  // Se obtiene de authenticateToken
      const itemId = parseInt(req.body.itemId, 10); // Asegúrate de que sea un número

      const userData = await prisma.user.findUnique({ where: { id: userId } });
      if (!userData) {
          res.json({ success: false, message: "User not found" });
          return;
      }

      // Inicializa cartData si no existe
      let cartData = userData.cartData as Record<string, number> || {};
      cartData[itemId] = (cartData[itemId] || 0) + 1;

      await prisma.user.update({
          where: { id: userId },
          data: { cartData }
      });

      res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error adding to cart" });
  }
};



// Eliminar del carrito del usuario
export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const itemId = req.body.itemId;

        const userData = await prisma.user.findUnique({ where: { id: userId } });
        if (!userData) {
            res.json({ success: false, message: "User not found" });
            return;
        }

        let cartData = userData.cartData as Record<string, number> || {};

        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) delete cartData[itemId];
        }

        await prisma.user.update({
            where: { id: userId },
            data: { cartData }
        });

        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing from cart" });
    }
};

// Obtener el carrito del usuario
export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;

        const userData = await prisma.user.findUnique({ where: { id: userId } });
        if (!userData) {
            res.json({ success: false, message: "User not found" });
            return;
        }

        res.json({ success: true, cartData: userData.cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error retrieving cart" });
    }
};
