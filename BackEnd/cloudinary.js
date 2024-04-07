// dotenv configuration
const dotenv = require("dotenv");
dotenv.config();

// Cloudinary Library
const cloudinary = require("cloudinary").v2;

// Configuring cloudinary with the env api keys
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;