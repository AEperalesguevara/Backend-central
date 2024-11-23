import express from "express";
import {
  createReservation,
  getReservations,
} from "../controllers/reservationController";

const reservationRouter = express.Router();

// Ruta para crear una reserva
reservationRouter.post("/", createReservation);

// Ruta para obtener todas las reservas
reservationRouter.get("/", getReservations);

export default reservationRouter;
