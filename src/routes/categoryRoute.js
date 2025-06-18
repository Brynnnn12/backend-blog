const express = require("express");
const router = express.Router();
const {
  index,
  store,
  destroy,
  update,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Kategori
 *   description: Manajemen kategori artikel
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Dapatkan semua kategori
 *     tags: [Kategori]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah item per halaman
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diperoleh
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 - id: "1"
 *                   name: "Teknologi"
 *                   slug: "teknologi"
 *                   createdAt: "2023-01-01T00:00:00Z"
 *                   updatedAt: "2023-01-01T00:00:00Z"
 *                 - id: "2"
 *                   name: "Kesehatan"
 *                   slug: "kesehatan"
 *                   createdAt: "2023-01-02T00:00:00Z"
 *                   updatedAt: "2023-01-02T00:00:00Z"
 *       401:
 *         description: Tidak terotentikasi
 *       403:
 *         description: Akses ditolak, hanya untuk Admin
 */
router.get("/", authorize("Admin"), index);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Buat kategori baru
 *     tags: [Kategori]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Olahraga"
 *             slug: "olahraga"
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "3"
 *                 name: "Olahraga"
 *                 slug: "olahraga"
 *                 createdAt: "2023-01-03T00:00:00Z"
 *                 updatedAt: "2023-01-03T00:00:00Z"
 *       400:
 *         description: Data input tidak valid
 *       401:
 *         description: Tidak terotentikasi
 *       403:
 *         description: Akses ditolak, hanya untuk Admin
 */
router.post("/", authorize("Admin"), store);

/**
 * @swagger
 * /categories/{slug}:
 *   put:
 *     summary: Perbarui kategori
 *     tags: [Kategori]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug kategori yang akan diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Teknologi Terkini"
 *             slug: "teknologi-terkini"
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "1"
 *                 name: "Teknologi Terkini"
 *                 slug: "teknologi-terkini"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-04T00:00:00Z"
 *       400:
 *         description: Data input tidak valid
 *       401:
 *         description: Tidak terotentikasi
 *       403:
 *         description: Akses ditolak, hanya untuk Admin
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.put("/:slug", authorize("Admin"), update);

/**
 * @swagger
 * /categories/{slug}:
 *   delete:
 *     summary: Hapus kategori
 *     tags: [Kategori]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug kategori yang akan dihapus
 *     responses:
 *       204:
 *         description: Kategori berhasil dihapus
 *       401:
 *         description: Tidak terotentikasi
 *       403:
 *         description: Akses ditolak, hanya untuk Admin
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.delete("/:slug", authorize("Admin"), destroy);

module.exports = router;
