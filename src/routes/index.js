const express = require("express");
const router = express.Router();
const roleRoutes = require("./roleRoutes");
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");

const {
  permissionMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");

// Route untuk mendapatkan semua role
router.use("/roles", authMiddleware, permissionMiddleware("Admin"), roleRoutes);
// Route untuk autentikasi
router.use("/", authRoutes);
// Route untuk profile
router.use("/profile", authMiddleware, profileRoutes);

module.exports = router;
