const WebsiteContent = require("../models/WebsiteContent");

// GET CONTENT BY SECTION
exports.getContent = async (req, res) => {
  try {
    const { section } = req.params;
    const content = await WebsiteContent.findOne({ section });
    
    if (!content) {
      // Return default content if not found
      return res.json(getDefaultContent(section));
    }
    
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL CONTENT
exports.getAllContent = async (req, res) => {
  try {
    const content = await WebsiteContent.find();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CONTENT (ADMIN)
exports.updateContent = async (req, res) => {
  try {
    const { section } = req.params;
    const updateData = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.heroImage) {
        updateData.heroImage = `/uploads/${req.files.heroImage[0].filename}`;
      }
      if (req.files.engineeringImage) {
        updateData.engineeringImage = `/uploads/${req.files.engineeringImage[0].filename}`;
      }
      if (req.files.supportImage) {
        updateData.supportImage = `/uploads/${req.files.supportImage[0].filename}`;
      }
      if (req.files.carouselImages) {
        updateData.carouselImages = req.files.carouselImages.map(
          file => `/uploads/${file.filename}`
        );
      }
      if (req.files.technologyImage) {
        updateData.technologyImage = `/uploads/${req.files.technologyImage[0].filename}`;
      }
    }

    const content = await WebsiteContent.findOneAndUpdate(
      { section },
      updateData,
      { new: true, upsert: true }
    );

    res.json({
      message: "Content updated successfully",
      content
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper function for default content
function getDefaultContent(section) {
  const defaults = {
    hero: {
      section: "hero",
      heroTitle: "MetroVolt",
      heroSubtitle: "Redefining Energy.",
      heroTagline: "Future Mobility",
      heroDescription: "The next generation of electric performance. Built with precision. Engineered for the modern world.",
      heroButton1Text: "Explore Models",
      heroButton2Text: "Technology"
    },
    metrics: {
      section: "metrics",
      metrics: [
        { label: "Top Speed", value: "25 mph", icon: "⚡" },
        { label: "Range", value: "30 miles", icon: "🔋" },
        { label: "Charge Time", value: "4 hours", icon: "⚙️" }
      ]
    },
    engineering: {
      section: "engineering",
      engineeringTitle: "Engineering Excellence",
      engineeringDescription: "Built with precision and innovation."
    },
    support: {
      section: "support",
      supportTitle: "24/7 Support",
      supportDescription: "We're here to help you every step of the way."
    },
    technology: {
      section: "technology",
      technologyTitle: "Technology & Innovation",
      technologySubtitle: "Cutting-edge engineering meets sustainable mobility",
      technologyDescription: "Discover the technology that powers MetroVolt.",
      technologyFeatures: [
        {
          icon: "battery",
          title: "Advanced Battery Technology",
          description: "Lithium-ion battery with smart power management system."
        },
        {
          icon: "gauge",
          title: "Precision Motor Control",
          description: "High-torque brushless motor with intelligent speed control."
        },
        {
          icon: "shield",
          title: "Safety First",
          description: "Advanced safety features including anti-lock braking and LED lighting."
        },
        {
          icon: "cpu",
          title: "Smart Connectivity",
          description: "Integrated app connectivity for GPS tracking and ride analytics."
        },
        {
          icon: "settings",
          title: "Adaptive Performance",
          description: "AI-powered performance optimization that adapts to your riding style."
        },
        {
          icon: "zap",
          title: "Rapid Charging",
          description: "Fast-charge technology that gets you back on the road in under 4 hours."
        }
      ],
      technologyStats: [
        { value: "99%", label: "Customer Satisfaction" },
        { value: "5 Years", label: "Warranty Coverage" },
        { value: "24/7", label: "Technical Support" }
      ]
    }
  };
  
  return defaults[section] || {};
}
