import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear una nueva reserva
export const createReservation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, phone, date, time, guests } = req.body;

  try {
    // Validaciones básicas
    if (!name || !email || !phone || !date || !time || !guests) {
      res
        .status(400)
        .json({
          success: false,
          message: "Todos los campos son obligatorios.",
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
        guests,
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

// Obtener todas las reservas
export const getReservations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reservations = await prisma.reservation.findMany();
    res.status(200).json({ success: true, reservations });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    next(error);
  }
};
