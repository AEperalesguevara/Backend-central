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
exports.deleteFood = exports.createFood = exports.getAllFoods = void 0;
const db_1 = __importDefault(require("../config/db"));
const getAllFoods = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.food.findMany();
});
exports.getAllFoods = getAllFoods;
const createFood = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.food.create({ data });
});
exports.createFood = createFood;
const deleteFood = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.food.delete({ where: { id } });
});
exports.deleteFood = deleteFood;
