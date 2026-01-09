const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

// CREATE REVIEW (USER)
router.post("/", auth, createReview);

// GET ALL REVIEWS (PUBLIC)
router.get("/", getReviews);

// GET SINGLE REVIEW
router.get("/:id", getReview);

// UPDATE REVIEW (USER - OWN REVIEW OR ADMIN)
router.put("/:id", auth, updateReview);

// DELETE REVIEW (USER - OWN REVIEW OR ADMIN)
router.delete("/:id", auth, deleteReview);

module.exports = router;
