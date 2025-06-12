const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
} = require("../controllers/roleControllers");

// Route untuk mendapatkan semua role
router.get("/", index);
// Route untuk menambahkan role baru
router.post("/", store);
// Route  untuk update role berdasarkan ID
router.put("/:id", update);
// Route untuk menghapus role berdasarkan ID
router.delete("/:id", destroy);

module.exports = router;
