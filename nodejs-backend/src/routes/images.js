const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imagesController");

const { ensureLogin } = require("../middleware/authMiddleware");
const {
  upload,
  cloudinaryUploadMiddleware,
} = require("../middleware/cloudinaryMiddleware");

router.get("/upload", ensureLogin, imageController.getImageUpload);
router.get("/editor", ensureLogin, imageController.getImageEditor);

router.post("/editor", ensureLogin, imageController.requestImageEditor);
router.post(
  "/upload",
  ensureLogin,
  upload.single("imageUpload"),
  cloudinaryUploadMiddleware,
  imageController.uploadImage,
);
router.post(
  "/editor/upload",
  ensureLogin,
  upload.single("imageFile"),
  imageController.editorUploadImage,
);
router.post(
  "/editor/update",
  ensureLogin,
  upload.single("imageFile"),
  imageController.editorUpdateImage,
);
router.post("/delete/images", ensureLogin, imageController.deleteImages);
router.post("/editor/grayscale", ensureLogin, imageController.applyGrayscale);
router.post("/editor/invert", ensureLogin, imageController.applyInvert);

module.exports = router;
