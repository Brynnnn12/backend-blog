const express = require("express");
const router = express.Router();
const { index, update, destroy } = require("../controllers/profileController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Profil
 *   description: Manajemen profil pengguna
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Dapatkan data profil pengguna
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil berhasil diperoleh
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "user123"
 *                 username: "johndoe"
 *                 email: "johndoe@example.com"
 *                 createdAt: "2023-01-01T00:00:00Z"
 *       401:
 *         description: Tidak terotentikasi
 */
router.get("/", index);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Perbarui profil pengguna
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: "johndoe_new"
 *             email: "john.new@example.com"
 *             password: "PasswordBaru123!"
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 id: "user123"
 *                 username: "johndoe_new"
 *                 email: "john.new@example.com"
 *                 updatedAt: "2023-01-05T00:00:00Z"
 *       400:
 *         description: Data input tidak valid
 *       401:
 *         description: Tidak terotentikasi
 */
router.put("/", update);

/**
 * @swagger
 * /profile:
 *   delete:
 *     summary: Hapus akun pengguna
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Akun berhasil dihapus
 *       401:
 *         description: Tidak terotentikasi
 */
router.delete("/", destroy);

module.exports = router;
