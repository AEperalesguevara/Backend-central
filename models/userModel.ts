import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string = "user" // Definir un valor por defecto, como "user"
) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password,
      role, // Agregar el campo role
      cartData: {}, // Si usas un campo JSON, lo mantienes igual
    },
  });
};
