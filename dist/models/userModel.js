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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findUserByEmail = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findUnique({
        where: { email },
    });
});
exports.findUserByEmail = findUserByEmail;
const createUser = (name_1, email_1, password_1, ...args_1) => __awaiter(void 0, [name_1, email_1, password_1, ...args_1], void 0, function* (name, email, password, role = "user" // Definir un valor por defecto, como "user"
) {
    return yield prisma.user.create({
        data: {
            name,
            email,
            password,
            role, // Agregar el campo role
            cartData: {}, // Si usas un campo JSON, lo mantienes igual
        },
    });
});
exports.createUser = createUser;
