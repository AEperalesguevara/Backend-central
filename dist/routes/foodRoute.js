"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const foodController_1 = require("../controllers/foodController");
// Configuración de multer para manejar archivos de imagen
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
// Ruta para agregar alimentos
router.post('/add', upload.single('image'), foodController_1.addFood);
// Ruta para eliminar alimentos
router.post('/remove', foodController_1.removeFood);
// Ruta para listar alimentos
router.get('/list', foodController_1.listFood);
exports.default = router;
