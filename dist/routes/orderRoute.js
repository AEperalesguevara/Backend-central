"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const orderController_1 = require("../controllers/orderController");
const orderRouter = express_1.default.Router();
// Las funciones en los controladores deben ajustarse para no retornar un valor o retornar `void`
orderRouter.get("/list", orderController_1.listOrders); // Debe retornar `void`
orderRouter.post("/userorders", auth_1.default, orderController_1.userOrders); // Debe retornar `void`
orderRouter.post("/place", auth_1.default, orderController_1.placeOrder); // Debe retornar `void`
orderRouter.post("/status", orderController_1.updateStatus); // Debe retornar `void`
orderRouter.post("/verify", orderController_1.verifyOrder); // Debe retornar `void`
orderRouter.post("/placecod", auth_1.default, orderController_1.placeOrderCod); // Debe retornar `void`
exports.default = orderRouter;
