const mongoose = require("mongoose");

const scooterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },

    description: String,

    images: [String], // Array of image URLs/paths

    features: [String], // Array of feature descriptions

    specs: {
      speed: String,
      range: String,
      weight: String,
      motor: String
    },

    colors: [String],

    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scooter", scooterSchema);
