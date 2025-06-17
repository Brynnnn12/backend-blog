const express = require("express");
const router = express.Router();
const roleRoutes = require("./roleRoutes");
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const categoryRoutes = require("./categoryRoute");
const postRoutes = require("./postRoutes");
const commentRoutes = require("./commentRoutes");

// Route untuk mendapatkan semua role
router.use("/roles", roleRoutes);
// Route untuk autentikasi
router.use("/", authRoutes);
// Route untuk profile
router.use("/profile", profileRoutes);
// Route untuk categories
router.use(
  "/categories",

  categoryRoutes
);

// Route untuk posts
router.use("/posts", postRoutes);

// Route untuk comments
router.use("/comments", commentRoutes);

module.exports = router;
