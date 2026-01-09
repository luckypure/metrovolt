const express = require("express");
const cors = require("cors");

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      /^http:\/\/localhost:\d+$/
    ];
    if (!origin) return callback(null, true);
    const ok = allowed.some(entry =>
      typeof entry === "string" ? entry === origin : entry.test(origin)
    );
    callback(null, ok);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("MetroVolt API Running 🚀");
});

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/scooters", require("./routes/scooterRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/content", require("./routes/contentRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/showrooms", require("./routes/showroomRoutes"));
app.use("/api/otp", require("./routes/otpRoutes"));


module.exports = app;
