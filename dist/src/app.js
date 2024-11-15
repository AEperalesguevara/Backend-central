"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const foodRoute_1 = __importDefault(require("../routes/foodRoute"));
const userRoute_1 = __importDefault(require("../routes/userRoute"));
require("dotenv/config");
const orderRoute_1 = __importDefault(require("../routes/orderRoute"));
const cartRoute_1 = __importDefault(require("../routes/cartRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Definir rutas
app.use("/api/food", foodRoute_1.default);
app.use("/api/user", userRoute_1.default);
app.use("/api/order", orderRoute_1.default);
app.use("/api/cart", cartRoute_1.default);
// Definir ruta estática para imágenes
app.use("/images", express_1.default.static("uploads"));
exports.default = app;
