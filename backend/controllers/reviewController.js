const Review = require("../models/Review");
const Order = require("../models/Order");

// CREATE REVIEW (USER)
exports.createReview = async (req, res) => {
  try {
    const { scooter, rating, comment } = req.body;
    const userId = req.user.id;

    // 1. Check if review already exists
    const existingReview = await Review.findOne({ user: userId, scooter });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // 2. Check if user has purchased this scooter
    // We check for orders that are not cancelled
    const hasPurchased = await Order.findOne({
      user: userId,
      "items.scooter": scooter,
      status: { $in: ["delivered", "shipped", "processing", "pending"] } 
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: "You can only review products you have purchased." });
    }

    const review = await Review.create({
      user: userId,
      scooter,
      rating,
      comment,
      verifiedPurchase: true
    });

    await review.populate("user", "name");
    await review.populate("scooter", "name");

    res.status(201).json({
      message: "Review created successfully",
      review
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL REVIEWS (PUBLIC)
exports.getReviews = async (req, res) => {
  try {
    const { scooter } = req.query;
    const query = scooter ? { scooter } : {};

    const reviews = await Review.find(query)
      .populate("user", "name")
      .populate("scooter", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE REVIEW
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name")
      .populate("scooter", "name");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE REVIEW (USER - OWN REVIEW ONLY)
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    await review.populate("user", "name");
    await review.populate("scooter", "name");

    res.json({
      message: "Review updated successfully",
      review
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE REVIEW (USER - OWN REVIEW OR ADMIN)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
