/* eslint-disable no-undef */
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Untuk generate unique ID

// Filter file untuk validasi tipe file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, GIF are allowed"), false);
  }
};

// Konfigurasi storage untuk posts
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../public/uploads/posts");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Gunakan title yang akan dijadikan slug (jika ada dalam body)
    const title = req.body?.title || "";
    // Buat slug sederhana dari title (lowercase, ganti spasi dengan dash)
    const slugText = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    // Tambahkan unique ID pendek untuk mencegah collision
    const uniqueId = uuidv4().substring(0, 8);
    const ext = path.extname(file.originalname);

    // Format: post-slug-uniqueid.ext
    cb(null, `post-${slugText}-${uniqueId}${ext}`);
  },
});

// Middleware untuk upload post
const uploadPost = multer({
  storage: postStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

module.exports = {
  uploadPost,
};
