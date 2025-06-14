const express = require("express");
const router = express.Router();
const {
  index,
  store,
  destroy,
  update,
} = require("../controllers/categoryController");

router.get("/", index);
router.post("/", store);
router.put("/:slug", update);
router.delete("/:slug", destroy);

module.exports = router;
