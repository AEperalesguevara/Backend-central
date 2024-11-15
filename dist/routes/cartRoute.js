"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const auth_1 = __importDefault(require("../middleware/auth"));
const cartRouter = express_1.default.Router();
cartRouter.post("/get", auth_1.default, cartController_1.getCart);
cartRouter.post("/add", auth_1.default, cartController_1.addToCart);
cartRouter.post("/remove", auth_1.default, cartController_1.removeFromCart);
exports.default = cartRouter;
