import express from "express";
import {
  createReservation,
  getReservations,
} from "../controllers/reservationController";

const reservationRouter = express.Router();

// Ruta para crear una reserva
reservationRouter.post("/add", createReservation);

// Ruta para obtener todas las reservas
reservationRouter.get("/get", getReservations);

export default reservationRouter;
