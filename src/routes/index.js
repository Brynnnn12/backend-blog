const express = require("express");
const router = express.Router();
const roleRoutes = require("./roleRoutes");

// Route untuk mendapatkan semua role
router.use("/roles", roleRoutes);

module.exports = router;
