import { Request, Response } from 'express';
import prisma from '../config/db';
import fs from 'fs';

// Listar todos los alimentos
export const listFood = async (req: Request, res: Response): Promise<void> => {
    try {
        const foods = await prisma.food.findMany();
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};

// Agregar un alimento
export const addFood = async (req: Request, res: Response): Promise<void> => {
  try {
      console.log("Body recibido:", req.body);
      console.log("Archivo recibido:", req.file);

      if (!req.file) {
          console.log("Error: No se ha subido ningún archivo.");
          res.status(400).json({ success: false, message: "Image file is required." });
          return;
      }

      if (!req.body.name || !req.body.price || !req.body.category) {
          console.log("Error: Faltan campos obligatorios.");
          res.status(400).json({ success: false, message: "All fields are required." });
          return;
      }

      const price = parseFloat(req.body.price);
      if (isNaN(price)) {
          console.log("Error: El precio no es un número válido.");
          res.status(400).json({ success: false, message: "Price must be a valid number." });
          return;
      }

      const food = await prisma.food.create({
          data: {
              name: req.body.name,
              description: req.body.description,
              price: price,
              category: req.body.category,
              image: req.file.filename,
          },
      });

      res.json({ success: true, message: "Food Added", data: food });
  } catch (error) {
      console.log("Error en el servidor:", error);
      res.status(500).json({ success: false, message: "Server error." });
  }
};


// Eliminar un alimento
export const removeFood = async (req: Request, res: Response): Promise<void> => {
    try {
        // Obtener el ID del cuerpo de la petición
        const foodId = parseInt(req.body.id, 10);

        if (isNaN(foodId)) {
            res.status(400).json({ success: false, message: "Invalid food ID." });
            return;
        }

        const food = await prisma.food.findUnique({ where: { id: foodId } });

        if (!food) {
            res.status(404).json({ success: false, message: "Food not found." });
            return;
        }

        if (food.image) {
            fs.unlink(`uploads/${food.image}`, (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo:", err);
                }
            });
        }

        await prisma.food.delete({ where: { id: foodId } });
        res.json({ success: true, message: "Food Removed" });

    } catch (error) {
        console.error("Error en removeFood:", error);
        res.status(500).json({ success: false, message: "Error" });
    }
  };


