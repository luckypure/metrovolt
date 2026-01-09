const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/orderController");

// CREATE ORDER (USER)
router.post("/", auth, createOrder);

// GET USER ORDERS (USER)
router.get("/my", auth, getUserOrders);

// GET ALL ORDERS (ADMIN)
router.get("/", auth, admin, getAllOrders);

// GET SINGLE ORDER
router.get("/:id", auth, getOrder);

// UPDATE ORDER STATUS (ADMIN)
router.put("/:id", auth, admin, updateOrderStatus);

// DELETE ORDER (ADMIN)
router.delete("/:id", auth, admin, deleteOrder);

module.exports = router;
