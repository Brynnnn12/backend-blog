const express = require("express");
const router = express.Router();
const { index, update, destroy } = require("../controllers/profileController");

const { protect } = require("../middlewares/authMiddleware");

router.use(protect); // Ensure all routes are protected

router.get("/", index);
router.put("/", update);
router.delete("/", destroy);

module.exports = router;
