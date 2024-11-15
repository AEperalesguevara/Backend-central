import express from "express";
import cors from "cors";
import foodRouter from "../routes/foodRoute";
import userRouter from "../routes/userRoute";
import "dotenv/config";
import orderRouter from "../routes/orderRoute";
import cartRouter from "../routes/cartRoute";

const app = express();

app.use(cors());
app.use(express.json());

// Definir rutas
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

// Definir ruta estática para imágenes
app.use("/images", express.static("uploads"));

export default app;
