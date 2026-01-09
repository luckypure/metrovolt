const mongoose = require("mongoose");

const websiteContentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      enum: ["hero", "metrics", "engineering", "support", "technology"]
    },

    // Hero Section
    heroImage: String,
    heroTitle: String,
    heroSubtitle: String,
    heroTagline: String,
    heroDescription: String,
    heroButton1Text: String,
    heroButton2Text: String,

    // Metrics Section
    metrics: [
      {
        label: String,
        value: String,
        icon: String
      }
    ],

    // Engineering/Support Section
    engineeringTitle: String,
    engineeringDescription: String,
    engineeringImage: String,
    supportTitle: String,
    supportDescription: String,
    supportImage: String,

    // Carousel/Slider Images
    carouselImages: [String],
    carouselTexts: [String], // Optional text for each slide

    // Technology Section
    technologyTitle: String,
    technologySubtitle: String,
    technologyDescription: String,
    technologyFeatures: [
      {
        icon: String,
        title: String,
        description: String
      }
    ],
    technologyStats: [
      {
        value: String,
        label: String
      }
    ],
    technologyImage: String

  },
  { timestamps: true }
);

module.exports = mongoose.model("WebsiteContent", websiteContentSchema);
