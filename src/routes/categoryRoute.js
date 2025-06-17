const express = require("express");
const router = express.Router();
const {
  index,
  store,
  destroy,
  update,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.use(protect); // Ensure all routes are protected

router.get("/", authorize("Admin"), index);
router.post("/", authorize("Admin"), store);
router.put("/:slug", authorize("Admin"), update);
router.delete("/:slug", authorize("Admin"), destroy);

module.exports = router;
