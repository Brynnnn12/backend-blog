const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
} = require("../controllers/roleControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Middleware untuk melindungi semua route ini
router.use(protect); // Pastikan semua route dilindungi

// Route untuk mendapatkan semua role
router.get("/", authorize("Admin"), index);
// Route untuk menambahkan role baru
router.post("/", authorize("Admin"), store);
// Route  untuk update role berdasarkan ID
router.put("/:id", authorize("Admin"), update);
// Route untuk menghapus role berdasarkan ID
router.delete("/:id", authorize("Admin"), destroy);

module.exports = router;
