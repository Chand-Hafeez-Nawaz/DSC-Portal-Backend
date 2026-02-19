const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

/* ================================
   CLOUDINARY CONFIG
================================ */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ================================
   MULTER + CLOUDINARY STORAGE
================================ */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dsc-events",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});

const upload = multer({ storage });

/* ================================
   CREATE EVENT
================================ */
router.post("/", upload.single("brochure"), async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      brochure: req.file ? req.file.path : "",
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Event creation failed" });
  }
});

/* ================================
   GET ALL EVENTS
================================ */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================================
   UPDATE EVENT
================================ */
router.put("/:id", upload.single("brochure"), async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const updatedData = {
      title,
      description,
      date,
    };

    if (req.file) {
      updatedData.brochure = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Event update failed" });
  }
});

/* ================================
   DELETE EVENT
================================ */
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;