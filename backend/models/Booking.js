const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
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
    showroom: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: String,
      email: String
    },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
