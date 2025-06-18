const express = require("express");
const router = express.Router();
const {
  index,
  store,
  update,
  destroy,
} = require("../controllers/roleControllers");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Manajemen peran pengguna
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Mendapatkan daftar semua role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 - id: "1"
 *                   name: "Admin"
 *                 - id: "2"
 *                   name: "User"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (khusus Admin)
 */
router.get("/", authorize("Admin"), index);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Membuat role baru
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Admin"
 *     responses:
 *       201:
 *         description: Role berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 id: "3"
 *                 name: "User"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (khusus Admin)
 */
router.post("/", authorize("Admin"), store);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Role berhasil diperbarui
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Admin"
 *     responses:
 *       200:
 *         description: Role berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 id: "3"
 *                 name: "Admin"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (khusus Admin)
 *       404:
 *         description: Role tidak ditemukan
 */
router.put("/:id", authorize("Admin"), update);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Hapus role
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID role
 *     responses:
 *       204:
 *         description: Role berhasil dihapus
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (khusus Admin)
 *       404:
 *         description: Role tidak ditemukan
 */
router.delete("/:id", authorize("Admin"), destroy);

module.exports = router;
