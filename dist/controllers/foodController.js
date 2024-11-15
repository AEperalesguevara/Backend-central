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
exports.removeFood = exports.addFood = exports.listFood = void 0;
const db_1 = __importDefault(require("../config/db"));
const fs_1 = __importDefault(require("fs"));
// Listar todos los alimentos
const listFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foods = yield db_1.default.food.findMany();
        res.json({ success: true, data: foods });
    }
    catch (error) {
        next(error);
    }
});
exports.listFood = listFood;
// Agregar un alimento
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Body recibido:", req.body);
        console.log("Archivo recibido:", req.file);
        if (!req.file) {
            console.log("Error: No se ha subido ningún archivo.");
            res
                .status(400)
                .json({ success: false, message: "Image file is required." });
            return;
        }
        if (!req.body.name || !req.body.price || !req.body.category) {
            console.log("Error: Faltan campos obligatorios.");
            res
                .status(400)
                .json({ success: false, message: "All fields are required." });
            return;
        }
        const price = parseFloat(req.body.price);
        if (isNaN(price)) {
            console.log("Error: El precio no es un número válido.");
            res
                .status(400)
                .json({ success: false, message: "Price must be a valid number." });
            return;
        }
        const food = yield db_1.default.food.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                price: price,
                category: req.body.category,
                image: req.file.filename,
            },
        });
        res.json({ success: true, message: "Food Added", data: food });
    }
    catch (error) {
        console.log("Error en el servidor:", error);
        next(error);
    }
});
exports.addFood = addFood;
// Eliminar un alimento
const removeFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foodId = parseInt(req.body.id, 10);
        if (isNaN(foodId)) {
            res.status(400).json({ success: false, message: "Invalid food ID." });
            return;
        }
        const food = yield db_1.default.food.findUnique({ where: { id: foodId } });
        if (!food) {
            res.status(404).json({ success: false, message: "Food not found." });
            return;
        }
        if (food.image) {
            fs_1.default.unlink(`uploads/${food.image}`, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo:", err);
                }
            });
        }
        yield db_1.default.food.delete({ where: { id: foodId } });
        res.json({ success: true, message: "Food Removed" });
    }
    catch (error) {
        console.error("Error en removeFood:", error);
        next(error);
    }
});
exports.removeFood = removeFood;
