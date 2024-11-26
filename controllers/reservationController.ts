import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer"; // Asegúrate de tener nodemailer instalado

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({
  service: "Gmail", // Cambia esto según el proveedor que uses
  auth: {
    user: process.env.EMAIL_USER, // Usar variables de entorno
    pass: process.env.EMAIL_PASS, // Nunca guardes credenciales directamente en el código
  },
});

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

    // Enviar correo de confirmación
    const emailOptions = {
      from: process.env.EMAIL_USER, // Correo del remitente
      to: email, // Correo del cliente
      subject: "Confirmación de tu reserva",
      html: `
        <h1>Confirmación de Reserva</h1>
        <p>Hola ${name},</p>
        <p>Tu reserva ha sido confirmada:</p>
        <ul>
          <li><b>Fecha:</b> ${new Date(date).toLocaleDateString()}</li>
          <li><b>Hora:</b> ${time}</li>
          <li><b>Comensales:</b> ${guestsNumber}</li>
          <li><b>Teléfono:</b> ${phone}</li>
        </ul>
        <p>¡Gracias por elegirnos!</p>
      `,
    };

    await transporter.sendMail(emailOptions);

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: "Reserva creada y correo enviado con éxito.",
      reservation,
    });
  } catch (error) {
    console.error("Error al crear la reserva o enviar el correo:", error);
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
