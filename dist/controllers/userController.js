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
exports.registerUser = exports.loginUser = void 0;
const userModel_1 = require("../models/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
// Login de usuario
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, userModel_1.findUserByEmail)(email);
        if (!user) {
            res.status(404).json({ success: false, message: "User doesn't exist" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }
        const token = createToken(user.id);
        res.json({ success: true, token, userId: user.id });
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        next(error);
    }
});
exports.loginUser = loginUser;
// Función para crear token
const createToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    return jsonwebtoken_1.default.sign({ id }, secret);
};
// Registro de usuario
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, email } = req.body;
    try {
        const exists = yield (0, userModel_1.findUserByEmail)(email);
        if (exists) {
            res.status(409).json({ success: false, message: "User already exists" });
            return;
        }
        if (!validator_1.default.isEmail(email)) {
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
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield (0, userModel_1.createUser)(name, email, hashedPassword);
        const token = createToken(user.id);
        res.json({ success: true, token });
    }
    catch (error) {
        console.error("Error in registerUser:", error);
        next(error);
    }
});
exports.registerUser = registerUser;
