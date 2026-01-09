const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createScooter,
  getScooters,
  getScooter,
  updateScooter,
  deleteScooter
} = require("../controllers/scooterController");


// 📃 PUBLIC — all scooters
router.get("/", getScooters);

// 🔍 PUBLIC — single scooter
router.get("/:id", getScooter);


// ➕ ADMIN — create
router.post(
  "/",
  auth,
  admin,
  upload.array("images", 10), // Allow up to 10 images
  createScooter
);

// ✏ ADMIN — update
router.put(
  "/:id",
  auth,
  admin,
  upload.array("images", 10),
  updateScooter
);

// 🗑 ADMIN — delete
router.delete("/:id", auth, admin, deleteScooter);


module.exports = router;
