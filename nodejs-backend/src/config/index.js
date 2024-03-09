require("dotenv").config();

module.exports = {
  HTTP_PORT: process.env.PORT || 8080,
  HTTPS_PORT: process.env.PORT || 8443,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  MONGO_URI: process.env.DATABASE_CONNECTION_STRING,

  SESSION_SECRET: process.env.SESSION_SECRET,
};
