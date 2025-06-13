const express = require("express");
const router = express.Router();
const roleRoutes = require("./roleRoutes");
const authRoutes = require("./authRoutes");
const {
  permissionMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");

// Route untuk mendapatkan semua role
router.use("/roles", authMiddleware, permissionMiddleware("Admin"), roleRoutes);
// Route untuk autentikasi
router.use("/", authRoutes);

module.exports = router;
