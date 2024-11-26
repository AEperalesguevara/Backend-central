"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservations = exports.createReservation = void 0;
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer")); // Asegúrate de tener nodemailer instalado
const prisma = new client_1.PrismaClient();
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail", // Cambia esto según el proveedor que uses
    auth: {
        user: process.env.EMAIL_USER, // Usar variables de entorno
        pass: process.env.EMAIL_PASS, // Nunca guardes credenciales directamente en el código
    },
});
const createReservation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const reservation = yield prisma.reservation.create({
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
        yield transporter.sendMail(emailOptions);
        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: "Reserva creada y correo enviado con éxito.",
            reservation,
        });
    }
    catch (error) {
        console.error("Error al crear la reserva o enviar el correo:", error);
        next(error);
    }
});
exports.createReservation = createReservation;
// Obtener todas las reservas
const getReservations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservations = yield prisma.reservation.findMany();
        res.status(200).json({ success: true, reservations });
    }
    catch (error) {
        console.error("Error al obtener reservas:", error);
        next(error);
    }
});
exports.getReservations = getReservations;
