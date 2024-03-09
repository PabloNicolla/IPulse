const express = require("express");
const router = express.Router();
const publicController = require("../controllers/publicController");

router.get("/", publicController.getRoot);
router.get("/homepage", publicController.getHomepage);
router.get("/about%20us", publicController.getAboutUsPage);
router.get("/terms%20of%20service", publicController.getTermsOfServicePage);
router.get("/privacy%20policy", publicController.getPrivacyPolicyPage);
router.get("/support", publicController.getSupportPage);
router.get("/search", publicController.getSearchPage);
router.get(
  "/search/recommendations",
  publicController.getSearchRecommendations,
);
router.get("/get-theme", publicController.getTheme);

router.post("/set-theme", publicController.setTheme);

module.exports = router;
