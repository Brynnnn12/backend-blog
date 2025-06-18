const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Autentikasi
 *   description: Endpoint untuk manajemen autentikasi pengguna
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Mendaftarkan pengguna baru
 *     tags: [Autentikasi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *                 description: Nama pengguna
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: Alamat email
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *                 description: Kata sandi (minimal 6 karakter)
 *     responses:
 *       201:
 *         description: Pendaftaran berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Input tidak valid atau email sudah terdaftar
 */

router.post("/register", register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Masuk ke sistem
 *     tags: [Autentikasi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@gmail.com
 *                 description: Alamat email terdaftar
 *               password:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *                 description: Kata sandi
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 token:
 *                   type: string
 *                   description: Token JWT untuk autentikasi
 *       401:
 *         description: Email atau password salah
 */

router.post("/login", login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Keluar dari sistem
 *     tags: [Autentikasi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Berhasil logout
 *       401:
 *         description: Tidak terautentikasi
 *       500:
 *         description: Kesalahan server
 */

router.post("/logout", protect, logout);

module.exports = router;
