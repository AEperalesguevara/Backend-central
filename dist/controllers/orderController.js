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
exports.placeOrderCod = exports.verifyOrder = exports.updateStatus = exports.userOrders = exports.listOrders = exports.placeOrder = void 0;
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("stripe"));
const prisma = new client_1.PrismaClient();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-09-30.acacia",
});
// Configuración de variables
const currency = "usd";
const deliveryCharge = 5;
const frontend_URL = "http://localhost:5173";
const placeOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOrder = yield prisma.order.create({
            data: {
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
            },
        });
        yield prisma.user.update({
            where: { id: req.body.userId },
            data: { cartData: {} },
        });
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));
        line_items.push({
            price_data: {
                currency,
                product_data: { name: "Delivery Charge" },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });
        const session = yield stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder.id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder.id}`,
            line_items,
            mode: "payment",
        });
        res.json({ success: true, session_url: session.url });
    }
    catch (error) {
        next(error);
    }
});
exports.placeOrder = placeOrder;
const placeOrderCod = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOrder = yield prisma.order.create({
            data: {
                userId: req.body.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
                payment: true,
            },
        });
        yield prisma.user.update({
            where: { id: req.body.userId },
            data: { cartData: {} },
        });
        res.json({ success: true, message: "Order Placed" });
    }
    catch (error) {
        next(error);
    }
});
exports.placeOrderCod = placeOrderCod;
const listOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany();
        res.json({ success: true, data: orders });
    }
    catch (error) {
        next(error);
    }
});
exports.listOrders = listOrders;
const userOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany({
            where: { userId: req.body.userId },
        });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        next(error);
    }
});
exports.userOrders = userOrders;
const updateStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.order.update({
            where: { id: req.body.orderId },
            data: { status: req.body.status },
        });
        res.json({ success: true, message: "Status Updated" });
    }
    catch (error) {
        next(error);
    }
});
exports.updateStatus = updateStatus;
const verifyOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            yield prisma.order.update({
                where: { id: orderId },
                data: { payment: true },
            });
            res.json({ success: true, message: "Paid" });
        }
        else {
            yield prisma.order.delete({
                where: { id: orderId },
            });
            res.json({ success: false, message: "Not Paid" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOrder = verifyOrder;
