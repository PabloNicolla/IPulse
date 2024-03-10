const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { ensureLogin } = require("../middleware/authMiddleware");
const {
  upload,
  cloudinaryUploadMiddleware,
} = require("../middleware/cloudinaryMiddleware");

router.get("/register", userController.getRegisterPage);
router.get("/login", userController.getLoginPage);
router.get("/logout", ensureLogin, userController.logout);
router.get("/dashboard", ensureLogin, userController.getDashboardPage);
router.get(
  "/dashboard/recommendations",
  ensureLogin,
  userController.getDashboardRecommendations,
);
router.get("/profile/update", ensureLogin, userController.getProfilePage);

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.post(
  "/profile/update",
  ensureLogin,
  upload.single("profilePicture"),
  cloudinaryUploadMiddleware,
  userController.updateProfile,
);

module.exports = router;
