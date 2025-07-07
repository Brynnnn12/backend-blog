const express = require("express");
const router = express.Router();
const {
  index,
  store,
  show,
  update,
  destroy,
  allComments,
} = require("../controllers/commentController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", allComments);

/**
 * @swagger
 * tags:
 *   name: Komentar
 *   description: Manajemen komentar pada artikel
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Dapatkan semua komentar
 *     tags: [Komentar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: Filter komentar berdasarkan ID artikel
 *     responses:
 *       200:
 *         description: Daftar komentar berhasil diperoleh
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 - id: "1"
 *                   content: "Artikel yang sangat bermanfaat"
 *                   postId: "101"
 *                   userId: "user123"
 *                   createdAt: "2023-01-01T00:00:00Z"
 *                 - id: "2"
 *                   content: "Terima kasih untuk informasinya"
 *                   postId: "101"
 *                   userId: "user456"
 *                   createdAt: "2023-01-02T00:00:00Z"
 *       401:
 *         description: Tidak terotentikasi
 */
router.get("/posts/:slug", index);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Buat komentar baru
 *     tags: [Komentar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "Komentar contoh"
 *             postId: "101"
 *     responses:
 *       201:
 *         description: Komentar berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "3"
 *                 content: "Komentar contoh"
 *                 postId: "101"
 *                 userId: "user789"
 *                 createdAt: "2023-01-03T00:00:00Z"
 *       400:
 *         description: Data input tidak valid
 *       401:
 *         description: Tidak terotentikasi
 */
router.post("/posts/:slug", protect, store);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Dapatkan detail komentar
 *     tags: [Komentar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID komentar
 *     responses:
 *       200:
 *         description: Detail komentar berhasil diperoleh
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "1"
 *                 content: "Artikel yang sangat bermanfaat"
 *                 postId: "101"
 *                 userId: "user123"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-01T00:00:00Z"
 *       401:
 *         description: Tidak terotentikasi
 *       404:
 *         description: Komentar tidak ditemukan
 */
router.get("/:id", protect, show);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Perbarui komentar
 *     tags: [Komentar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID komentar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "Komentar yang telah diperbarui"
 *     responses:
 *       200:
 *         description: Komentar berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "1"
 *                 content: "Komentar yang telah diperbarui"
 *                 postId: "101"
 *                 userId: "user123"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-04T00:00:00Z"
 *       400:
 *         description: Data input tidak valid
 *       401:
 *         description: Tidak terotentikasi
 *       403:
 *         description: Tidak memiliki izin mengedit komentar ini
 *       404:
 *         description: Komentar tidak ditemukan
 */
router.put("/:id", protect, update);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Hapus komentar
 *     tags: [Komentar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID komentar
 *     responses:
 *       204:
 *         description: Komentar berhasil dihapus
 *       401:
 *         description: Tidak terotentikasi
 *       403:
 *         description: Tidak memiliki izin menghapus komentar ini
 *       404:
 *         description: Komentar tidak ditemukan
 */
router.delete("/:id", protect, destroy);

module.exports = router;
