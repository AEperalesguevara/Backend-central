import { Request, Response, NextFunction } from "express";
import { findUserByEmail, createUser } from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id: number, role: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  // Agregar el rol al payload del token
  return jwt.sign({ id, role }, secret, { expiresIn: "1h" }); // 'role' ahora está incluido en el token
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      res.status(404).json({ success: false, message: "User doesn't exist" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Aquí generas el token con el 'role' incluido
    const token = createToken(user.id, user.role);

    // Responder con el token y el rol
    res.json({
      success: true,
      token,
      role: user.role, // Incluye el rol también en la respuesta
    });
    console.log("Respuesta del login:", {
      success: true,
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    next(error);
  }
};

// Registro de usuario
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, password, email } = req.body;

  try {
    const exists = await findUserByEmail(email);

    if (exists) {
      res.status(409).json({ success: false, message: "User already exists" });
      return;
    }

    if (!validator.isEmail(email)) {
      res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ success: false, message: "Please enter a strong password" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Aquí pasas "user" como rol predeterminado
    const user = await createUser(name, email, hashedPassword, "user");
    const token = createToken(user.id, "user");

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error in registerUser:", error);
    next(error);
  }
};
