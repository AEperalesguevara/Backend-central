import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.TU_CLOUD_NAME,
  api_key: process.env.TU_API_KEY,
  api_secret: process.env.TU_API_SECRET,
  secure: true,
});

export default cloudinary;
