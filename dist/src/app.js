"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const foodRoute_1 = __importDefault(require("../routes/foodRoute"));
const userRoute_1 = __importDefault(require("../routes/userRoute"));
const orderRoute_1 = __importDefault(require("../routes/orderRoute"));
const cartRoute_1 = __importDefault(require("../routes/cartRoute"));
const reservationRoute_1 = __importDefault(require("../routes/reservationRoute")); // Importa el nuevo router
require("dotenv/config");
const app = (0, express_1.default)();
// Configuración de CORS
app.use((0, cors_1.default)({
    origin: "*", // Reemplaza con el dominio de tu frontend
    methods: "GET, POST, PUT, DELETE", // Métodos HTTP permitidos
    credentials: true, // Permite el uso de cookies y autenticación en las solicitudes
}));
// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express_1.default.json());
// Rutas para las diferentes secciones de la API
app.use("/api/food", foodRoute_1.default);
app.use("/api/user", userRoute_1.default);
app.use("/api/order", orderRoute_1.default);
app.use("/api/cart", cartRoute_1.default);
app.use("/api/reservation", reservationRoute_1.default); // Agrega el nuevo router
// Ruta estática para servir las imágenes
app.use("/uploads", express_1.default.static("uploads"));
exports.default = app;
