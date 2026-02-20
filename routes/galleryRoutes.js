const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  uploadImages,
  getImages,
  deleteImage,
} = require("../controllers/galleryController");

/* ================= CREATE UPLOAD FOLDER IF NOT EXISTS ================= */

const uploadDir = path.join(__dirname, "../uploads/gallery");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================= MULTER STORAGE ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

router.post("/upload", upload.array("images", 50), uploadImages);
router.get("/", getImages);
router.delete("/:id", deleteImage);

module.exports = router;