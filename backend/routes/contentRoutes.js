const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getContent,
  getAllContent,
  updateContent
} = require("../controllers/contentController");

// GET ALL CONTENT (PUBLIC)
router.get("/", getAllContent);

// GET CONTENT BY SECTION (PUBLIC)
router.get("/:section", getContent);

// UPDATE CONTENT (ADMIN)
router.put(
  "/:section",
  auth,
  admin,
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "engineeringImage", maxCount: 1 },
    { name: "supportImage", maxCount: 1 },
    { name: "technologyImage", maxCount: 1 },
    { name: "carouselImages", maxCount: 10 }
  ]),
  updateContent
);

module.exports = router;
