const express = require("express");
const router = express.Router();
const { index, update, destroy } = require("../controllers/profileController");

router.get("/", index);
router.put("/", update);
router.delete("/", destroy);

module.exports = router;
