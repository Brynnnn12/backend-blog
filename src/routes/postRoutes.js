const express = require("express");
const router = express.Router();
const {
  index,
  store,
  show,
  update,
  destroy,
  getMyPosts,
} = require("../controllers/postControllers");
const { uploadPost } = require("../utils/fileUpload");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Postingan
 *   description: Manajemen postingan artikel
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Dapatkan semua postingan
 *     tags: [Postingan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter postingan berdasarkan kategori
 *     responses:
 *       200:
 *         description: Daftar postingan berhasil diperoleh
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 - id: "1"
 *                   title: "Judul Postingan Pertama"
 *                   slug: "judul-postingan-pertama"
 *                   content: "Ini adalah konten postingan pertama..."
 *                   image: "/uploads/posts/image1.jpg"
 *                   categoryId: "101"
 *                   userId: "user123"
 *                   createdAt: "2023-01-01T00:00:00Z"
 *                 - id: "2"
 *                   title: "Judul Postingan Kedua"
 *                   slug: "judul-postingan-kedua"
 *                   content: "Ini adalah konten postingan kedua..."
 *                   image: "/uploads/posts/image2.jpg"
 *                   categoryId: "102"
 *                   userId: "user456"
 *                   createdAt: "2023-01-02T00:00:00Z"
 *       401:
 *         description: Tidak terotentikasi
 */
router.get("/", index);

router.get("/my-posts", protect, getMyPosts); // Hanya post milik user yang login

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Buat postingan baru
 *     tags: [Postingan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Postingan berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "3"
 *                 title: "Judul Postingan Baru"
 *                 slug: "judul-postingan-baru"
 *                 content: "Ini adalah konten postingan baru..."
 *                 image: "/uploads/posts/image3.jpg"
 *                 categoryId: "103"
 *                 userId: "user789"
 *                 createdAt: "2023-01-03T00:00:00Z"
 *       400:
 *         description: Data input tidak valid
 *       401:
 *         description: Tidak terotentikasi
 */
router.post("/", protect, uploadPost.single("image"), store);

/**
 * @swagger
 * /posts/{slug}:
 *   get:
 *     summary: Dapatkan detail postingan
 *     tags: [Postingan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug postingan
 *     responses:
 *       200:
 *         description: Detail postingan berhasil diperoleh
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "1"
 *                 title: "Judul Postingan Pertama"
 *                 slug: "judul-postingan-pertama"
 *                 content: "Ini adalah konten lengkap postingan pertama..."
 *                 image: "/uploads/posts/image1.jpg"
 *                 categoryId: "101"
 *                 userId: "user123"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-01T00:00:00Z"
 *       401:
 *         description: Tidak terotentikasi
 *       404:
 *         description: Postingan tidak ditemukan
 */
router.get("/:slug", protect, show);

/**
 * @swagger
 * /posts/{slug}:
 *   put:
 *     summary: Perbarui postingan
 *     tags: [Postingan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug postingan
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Postingan berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "1"
 *                 title: "Judul Postingan Yang Diupdate"
 *                 slug: "judul-postingan-pertama"
 *                 content: "Ini adalah konten yang telah diupdate..."
 *                 image: "/uploads/posts/new-image.jpg"
 *                 categoryId: "101"
 *                 userId: "user123"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *                 updatedAt: "2023-01-04T00:00:00Z"
 *       400:
 *         description: Data input tidak valid
 *       401:
 *         description: Tidak terotentikasi
 *       403:
 *         description: Tidak memiliki izin mengedit postingan ini
 *       404:
 *         description: Postingan tidak ditemukan
 */
router.put("/:slug", protect, uploadPost.single("image"), update);

/**
 * @swagger
 * /posts/{slug}:
 *   delete:
 *     summary: Hapus postingan
 *     tags: [Postingan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug postingan
 *     responses:
 *       204:
 *         description: Postingan berhasil dihapus
 *       401:
 *         description: Tidak terotentikasi
 *       403:
 *         description: Tidak memiliki izin menghapus postingan ini
 *       404:
 *         description: Postingan tidak ditemukan
 */
router.delete("/:slug", protect, destroy);

module.exports = router;
