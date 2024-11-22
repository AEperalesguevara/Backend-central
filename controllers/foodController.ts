import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import fs from "fs";
import cloudinary from "../config/cloudinary";

// Listar todos los alimentos
export const listFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const foods = await prisma.food.findMany();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error en listFood:", error);
    next(error);
  }
};

// Agregar un alimento
export const addFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "menu_images",
        use_filename: true,
      });

      imageUrl = result.secure_url;

      // Eliminar el archivo local después de subirlo
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error al eliminar el archivo local:", err);
        }
      });
    } catch (cloudinaryError) {
      console.error("Error subiendo a Cloudinary:", cloudinaryError);
      res.status(500).json({
        success: false,
        message: "Error uploading image to Cloudinary",
      });
      return;
    }

    // Crear el producto en la base de datos con la URL de Cloudinary
    const food = await prisma.food.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: price,
        category: req.body.category,
        image: imageUrl, // Aseguramos que se guarde la URL de Cloudinary
      },
    });

    res.json({ success: true, message: "Food Added", data: food });
  } catch (error) {
    console.error("Error en addFood:", error);
    next(error);
  }
};

// Eliminar un alimento
export const removeFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
      // Extraer el public_id de la URL de Cloudinary
      const publicId = food.image.split("/").pop()?.split(".")[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(`menu_images/${publicId}`);
        } catch (cloudinaryError) {
          console.error(
            "Error eliminando imagen de Cloudinary:",
            cloudinaryError
          );
        }
      }
    }

    await prisma.food.delete({ where: { id: foodId } });
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error("Error en removeFood:", error);
    next(error);
  }
};
