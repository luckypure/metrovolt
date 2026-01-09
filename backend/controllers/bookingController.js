const Booking = require("../models/Booking");
const Scooter = require("../models/Scooter");
const { sendBookingEmail } = require("../services/emailService");

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { scooter, showroom, bookingDate, bookingTime, customerInfo, notes } = req.body;
    const userId = req.user.id;

    // Validate scooter exists
    const scooterExists = await Scooter.findById(scooter);
    if (!scooterExists) {
      return res.status(404).json({ message: "Scooter not found" });
    }

    const booking = await Booking.create({
      user: userId,
      scooter,
      showroom,
      bookingDate: new Date(bookingDate),
      bookingTime,
      customerInfo,
      notes,
      status: "pending"
    });

    await booking.populate("scooter", "name price");
    await booking.populate("user", "name email");

    // Send email confirmation
    try {
      await sendBookingEmail(booking);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json({
      message: "Ride booking created successfully",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET USER BOOKINGS
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ user: userId })
      .populate("scooter", "name price images")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL BOOKINGS (ADMIN)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("scooter", "name price")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE BOOKING
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("scooter", "name price images")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE BOOKING STATUS (ADMIN)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("scooter", "name price")
     .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: "Booking status updated",
      booking
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE BOOKING
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
