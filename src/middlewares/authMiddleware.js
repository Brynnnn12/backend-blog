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
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Anda belum login",
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau kedaluwarsa",
      });
    }

    const user = await Users.findByPk(decoded.id, {
      attributes: ["id"],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    req.user = { id: user.id }; // Simpan seminimal mungkin
    next();
  } catch (err) {
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
