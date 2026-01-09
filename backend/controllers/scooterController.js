const Scooter = require("../models/Scooter");


// ➕ CREATE (ADMIN)
exports.createScooter = async (req, res) => {
  try {
    const scooterData = { ...req.body };

    // Handle image uploads
    if (req.files) {
      const filesArray = Array.isArray(req.files)
        ? req.files
        : (req.files.images || []);
      if (filesArray.length > 0) {
        scooterData.images = filesArray.map(
          file => `/uploads/${file.filename}`
        );
      }
    }

    const scooter = await Scooter.create(scooterData);
    res.json(scooter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📃 GET ALL (PUBLIC)
exports.getScooters = async (req, res) => {
  try {
    const scooters = await Scooter.find();
    res.json(scooters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔍 GET ONE (PUBLIC)
exports.getScooter = async (req, res) => {
  try {
    const scooter = await Scooter.findById(req.params.id);
    res.json(scooter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✏ UPDATE (ADMIN)
exports.updateScooter = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle image uploads
    if (req.files) {
      const filesArray = Array.isArray(req.files)
        ? req.files
        : (req.files.images || []);
      if (filesArray.length > 0) {
        const newImages = filesArray.map(
          file => `/uploads/${file.filename}`
        );
        const existingScooter = await Scooter.findById(req.params.id);
        updateData.images = [...(existingScooter?.images || []), ...newImages];
      }
    }

    const scooter = await Scooter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(scooter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🗑 DELETE (ADMIN)
exports.deleteScooter = async (req, res) => {
  try {
    await Scooter.findByIdAndDelete(req.params.id);
    res.json({ message: "Scooter deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
