"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.TU_CLOUD_NAME,
    api_key: process.env.TU_API_KEY,
    api_secret: process.env.TU_API_SECRET,
    secure: true,
});
exports.default = cloudinary_1.v2;
