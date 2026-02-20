require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://dsc-portal-frontend-kappa.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================= MONGODB CONNECTION ================= */

const User = require("./models/User");
const bcrypt = require("bcryptjs");

const existing = await User.findOne({ email: "admin@dsc.in" });

if (!existing) {
  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    email: "admin@dsc.in",
    password: hashed,
    role: "admin"
  });

  console.log("Admin Created Automatically");
}
/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/gallery", galleryRoutes);

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});