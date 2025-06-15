const express = require("express");
const router = express.Router();
const {
  index,
  store,
  show,
  update,
  destroy,
} = require("../controllers/postControllers");
const { uploadPost } = require("../utils/fileUpload");

router.get("/", index);
router.post("/", uploadPost.single("image"), store);
router.get("/:slug", show);
router.put("/:slug", uploadPost.single("image"), update);
router.delete("/:slug", destroy);

module.exports = router;
