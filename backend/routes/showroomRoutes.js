const express = require("express");
const router = express.Router();

const {
  getShowrooms,
  getNearestShowrooms
} = require("../controllers/showroomController");

// GET ALL SHOWROOMS (PUBLIC)
router.get("/", getShowrooms);

// GET NEAREST SHOWROOMS (PUBLIC)
router.get("/nearest", getNearestShowrooms);

module.exports = router;
