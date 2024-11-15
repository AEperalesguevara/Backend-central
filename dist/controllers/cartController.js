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
exports.getCart = exports.removeFromCart = exports.addToCart = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Agregar al carrito del usuario
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const itemId = parseInt(req.body.itemId, 10);
        const userData = yield prisma.user.findUnique({ where: { id: userId } });
        if (!userData) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const cartData = userData.cartData || {};
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        yield prisma.user.update({
            where: { id: userId },
            data: { cartData },
        });
        res.json({ success: true, message: "Added To Cart" });
    }
    catch (error) {
        console.error("Error in addToCart:", error);
        next(error);
    }
});
exports.addToCart = addToCart;
// Eliminar del carrito del usuario
const removeFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const itemId = req.body.itemId;
        const userData = yield prisma.user.findUnique({ where: { id: userId } });
        if (!userData) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const cartData = userData.cartData || {};
        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        yield prisma.user.update({
            where: { id: userId },
            data: { cartData },
        });
        res.json({ success: true, message: "Removed From Cart" });
    }
    catch (error) {
        console.error("Error in removeFromCart:", error);
        next(error);
    }
});
exports.removeFromCart = removeFromCart;
// Obtener el carrito del usuario
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const userData = yield prisma.user.findUnique({ where: { id: userId } });
        if (!userData) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.json({ success: true, cartData: userData.cartData });
    }
    catch (error) {
        console.error("Error in getCart:", error);
        next(error);
    }
});
exports.getCart = getCart;
