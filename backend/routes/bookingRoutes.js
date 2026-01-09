const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBooking,
  updateBookingStatus,
  deleteBooking
} = require("../controllers/bookingController");

// CREATE BOOKING (USER)
router.post("/", auth, createBooking);

// GET USER BOOKINGS (USER)
router.get("/my", auth, getUserBookings);

// GET ALL BOOKINGS (ADMIN)
router.get("/", auth, admin, getAllBookings);

// GET SINGLE BOOKING
router.get("/:id", auth, getBooking);

// UPDATE BOOKING STATUS (ADMIN)
router.put("/:id", auth, admin, updateBookingStatus);

// DELETE BOOKING
router.delete("/:id", auth, deleteBooking);

module.exports = router;
