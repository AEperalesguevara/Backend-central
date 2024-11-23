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
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Listar todos los alimentos
const listFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foods = yield db_1.default.food.findMany();
        res.json({ success: true, data: foods });
    }
    catch (error) {
        console.error("Error en listFood:", error);
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
            res
                .status(400)
                .json({ success: false, message: "Image file is required." });
            return;
        }
        if (!req.body.name || !req.body.price || !req.body.category) {
            res
                .status(400)
                .json({ success: false, message: "All fields are required." });
            return;
        }
        const price = parseFloat(req.body.price);
        if (isNaN(price)) {
            res
                .status(400)
                .json({ success: false, message: "Price must be a valid number." });
            return;
        }
        // Subir imagen a Cloudinary
        let imageUrl = "";
        try {
            const result = yield cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "menu_images",
                use_filename: true,
            });
            imageUrl = result.secure_url;
            // Eliminar el archivo local después de subirlo
            fs_1.default.unlink(req.file.path, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo local:", err);
                }
            });
        }
        catch (cloudinaryError) {
            console.error("Error subiendo a Cloudinary:", cloudinaryError);
            res.status(500).json({
                success: false,
                message: "Error uploading image to Cloudinary",
            });
            return;
        }
        // Crear el producto en la base de datos con la URL de Cloudinary
        const food = yield db_1.default.food.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                price: price,
                category: req.body.category,
                image: imageUrl, // Aseguramos que se guarde la URL de Cloudinary
            },
        });
        res.json({ success: true, message: "Food Added", data: food });
    }
    catch (error) {
        console.error("Error en addFood:", error);
        next(error);
    }
});
exports.addFood = addFood;
// Eliminar un alimento
const removeFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
            // Extraer el public_id de la URL de Cloudinary
            const publicId = (_a = food.image.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0];
            if (publicId) {
                try {
                    yield cloudinary_1.default.uploader.destroy(`menu_images/${publicId}`);
                }
                catch (cloudinaryError) {
                    console.error("Error eliminando imagen de Cloudinary:", cloudinaryError);
                }
            }
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
