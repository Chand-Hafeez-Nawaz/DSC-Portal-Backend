const Event = require("../models/Event");

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      image: req.file ? req.file.path : null,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created successfully" });

  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ message: "Event operation failed" });
  }
};

// GET EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const updatedData = {
      title,
      description,
      date,
    };

    if (req.file) {
      updatedData.image = req.file.path;
    }

    await Event.findByIdAndUpdate(req.params.id, updatedData);

    res.json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  deleteEvent,
  updateEvent,
};