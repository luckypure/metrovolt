const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        scooter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Scooter",
          required: true
        },
        quantity: { type: Number, required: true, default: 1 },
        color: String,
        price: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    paymentMethod: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
