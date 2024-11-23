import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Validar datos de reserva
const validateReservationData = (data: any): string | null => {
  const { name, email, phone, date, time, guests } = data;

  if (!name || typeof name !== "string")
    return "El nombre es obligatorio y debe ser un texto.";
  if (!email || typeof email !== "string")
    return "El correo electrónico es obligatorio y debe ser un texto.";
  if (!phone || typeof phone !== "string")
    return "El teléfono es obligatorio y debe ser un texto.";
  if (!date || isNaN(Date.parse(date))) return "La fecha es inválida.";
  if (!time || typeof time !== "string")
    return "La hora es obligatoria y debe ser un texto.";
  if (!guests || typeof guests !== "number" || guests < 1)
    return "El número de comensales debe ser mayor o igual a 1.";

  return null; // Sin errores
};

// Ruta POST para crear una nueva reserva
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const error = validateReservationData(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const { name, email, phone, date, time, guests } = req.body;

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
      message: "Reserva creada con éxito.",
      reservation,
    });
  } catch (err) {
    console.error("Error al crear la reserva:", err);
    res
      .status(500)
      .json({
        error: "Error al crear la reserva. Por favor, intenta nuevamente.",
      });
  }
});

export default router;
