const express = require("express");
const router = express.Router();
const roleRoutes = require("./roleRoutes");
const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const categoryRoutes = require("./categoryRoute");
const postRoutes = require("./postRoutes");

const {
  permissionMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const { attachRole } = require("../middlewares/attachRole");

// Route untuk mendapatkan semua role
router.use(
  "/roles",
  authMiddleware,
  attachRole,
  permissionMiddleware("Admin"),
  roleRoutes
);
// Route untuk autentikasi
router.use("/", authRoutes);
// Route untuk profile
router.use("/profile", authMiddleware, profileRoutes);
// Route untuk categories
router.use(
  "/categories",
  authMiddleware,
  attachRole,
  permissionMiddleware("Admin"),
  categoryRoutes
);

// Route untuk posts
router.use("/posts", authMiddleware, postRoutes);

module.exports = router;
