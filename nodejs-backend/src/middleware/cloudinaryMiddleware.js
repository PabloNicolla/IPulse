const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const evnConfig = require("../config/index");

cloudinary.config({
  cloud_name: evnConfig.CLOUDINARY_CLOUD_NAME,
  api_key: evnConfig.CLOUDINARY_API_KEY,
  api_secret: evnConfig.CLOUDINARY_API_SECRET,
  secure: true,
});

const upload = multer({ storage: multer.memoryStorage() });

const cloudinaryUploadMiddleware = async (req, res, next) => {
  try {
    const uploaded = await uploadStreamToCloudinary(req.file.buffer);
    req.cloudinaryResult = uploaded; // Attach the result to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Upload failed", error);
    res.status(500).send("An error occurred during file upload.");
  }
};

const uploadStreamToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = { resource_type: "auto", ...options };
    let stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(fileBuffer);
  });
};

const uploadToCloudinary2 = (filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = { resource_type: "image", ...options };
    cloudinary.uploader.upload(filePath, uploadOptions, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

module.exports = {
  upload,
  cloudinaryUploadMiddleware,
  uploadStreamToCloudinary,
  uploadToCloudinary2,
};
