"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservationController_1 = require("../controllers/reservationController");
const reservationRouter = express_1.default.Router();
// Ruta para crear una reserva
reservationRouter.post("/", reservationController_1.createReservation);
// Ruta para obtener todas las reservas
reservationRouter.get("/", reservationController_1.getReservations);
exports.default = reservationRouter;
