import { Router, Request, Response } from 'express';
import multer from 'multer';
import { addFood, removeFood, listFood } from '../controllers/foodController';

// Configuración de multer para manejar archivos de imagen
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');

    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const router = Router();

// Ruta para agregar alimentos
router.post('/add', upload.single('image'), addFood);


// Ruta para eliminar alimentos
router.post('/remove', removeFood);


// Ruta para listar alimentos
router.get('/list', listFood);

export default router;
