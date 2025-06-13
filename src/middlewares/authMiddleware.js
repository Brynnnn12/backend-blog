/* eslint-disable no-unused-vars */
const jwt = require("jsonwebtoken");
const { Users, Roles } = require("../models");
const { verifyToken } = require("../utils/jwtUtils");

/**
 * Middleware untuk verifikasi autentikasi
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Ekstrak token dari header atau cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Anda belum login, silakan login terlebih dahulu",
      });
    }

    // Verifikasi token menggunakan fungsi verifyToken dari jwtUtils
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau sudah kedaluwarsa",
      });
    }

    // Cari user dengan role
    const currentUser = await Users.findByPk(decoded.id, {
      include: [{ model: Roles, as: "role", attributes: ["name"] }],
    });

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan atau tidak aktif",
      });
    }

    // // Periksa apakah token diterbitkan sebelum password diubah
    // if (decoded.iat < new Date(currentUser.updatedAt).getTime() / 1000) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "User baru-baru ini mengubah password, silakan login kembali",
    //   });
    // }

    // Tambahkan user ke request object
    req.user = currentUser;
    next();
  } catch (error) {
    // Untuk error lainnya
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan autentikasi",
    });
  }
};

/**
 * Middleware untuk verifikasi hak akses
 * @param {...String} roles - Daftar role yang diizinkan
 * @returns {Function} Middleware function
 */
exports.permissionMiddleware = (...roles) => {
  return (req, res, next) => {
    // Pastikan user dan role ada
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Tidak memiliki role yang valid",
      });
    }

    const roleName = req.user.role.name;

    // Periksa apakah role pengguna termasuk dalam roles yang diizinkan
    if (!roles.includes(roleName)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk mengakses resource ini",
      });
    }

    next();
  };
};
