const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    scooter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scooter",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    verifiedPurchase: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
