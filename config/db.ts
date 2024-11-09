import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();

export default prisma;
