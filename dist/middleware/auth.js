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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
        return;
    }
    if (!process.env.JWT_SECRET) {
        console.error("JWT secret is not defined in environment variables.");
        res.status(500).json({ success: false, message: 'Server configuration error.' });
        return;
    }
    try {
        const token_decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    }
    catch (error) {
        const errorMessage = error instanceof jsonwebtoken_1.default.JsonWebTokenError
            ? 'Invalid token. Please login again.'
            : 'Token verification failed. Please try again.';
        res.status(401).json({ success: false, message: errorMessage });
    }
});
exports.default = authMiddleware;
