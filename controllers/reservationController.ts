import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, phone, date, time, guests } = req.body;

  try {
    // Validaciones básicas
    if (!name || !email || !phone || !date || !time || guests === undefined) {
      res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios.",
      });
      return;
    }

    // Validación adicional para 'guests'
    const guestsNumber = parseInt(guests, 10);
    if (isNaN(guestsNumber) || guestsNumber < 1 || guestsNumber > 20) {
      res.status(400).json({
        success: false,
        message: "El número de comensales debe ser un número entre 1 y 20.",
      });
      return;
    }

    // Crear la reserva en la base de datos
    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        phone,
        date: new Date(date),
        time,
        guests: guestsNumber,
      },
    });

    res.status(201).json({
      success: true,
      message: "Reserva creada con éxito.",
      reservation,
    });
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    next(error);
  }
};
