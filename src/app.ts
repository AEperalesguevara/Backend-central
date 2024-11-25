import express from "express";
import cors from "cors";
import foodRouter from "../routes/foodRoute";
import userRouter from "../routes/userRoute";
import orderRouter from "../routes/orderRoute";
import cartRouter from "../routes/cartRoute";
import reservationRouter from "../routes/reservationRoute"; // Importa el nuevo router
import "dotenv/config";
import connectCloudinary from "../config/cloudinary";

const app = express();
connectCloudinary();

// Configuración de CORS
app.use(
  cors({
    origin: "*", // Reemplaza con el dominio de tu frontend
    methods: "GET, POST, PUT, DELETE", // Métodos HTTP permitidos
    credentials: true, // Permite el uso de cookies y autenticación en las solicitudes
  })
);

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas para las diferentes secciones de la API
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/reservation", reservationRouter); // Agrega el nuevo router

// Ruta estática para servir las imágenes
app.use("/uploads", express.static("uploads"));

export default app;
