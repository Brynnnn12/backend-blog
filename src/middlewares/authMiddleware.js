/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const asyncHandler = require("express-async-handler");

/**
 * Fungsi untuk mengirim respons error dengan format yang konsisten
 */
const sendErrorResponse = (res, statusCode, code, message) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

/**
 * Middleware untuk memproteksi route yang memerlukan autentikasi
 */
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ Ambil token dari cookie ATAU Authorization header
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return sendErrorResponse(
      res,
      401,
      "UNAUTHORIZED_ACCESS",
      "Silahkan login terlebih dahulu untuk mengakses fitur ini."
    );
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil data user
    const user = await Users.findByPk(decoded.id, {
      attributes: ["id", "username", "email", "roleId"],
      include: {
        association: "role",
        attributes: ["name"],
      },
    });

    if (!user) {
      return sendErrorResponse(
        res,
        401,
        "USER_NOT_FOUND",
        "User tidak ditemukan. Silahkan login kembali."
      );
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role ? user.role.name : null,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return sendErrorResponse(
        res,
        401,
        "INVALID_TOKEN",
        "Token tidak valid. Silahkan login kembali."
      );
    }

    if (error.name === "TokenExpiredError") {
      return sendErrorResponse(
        res,
        401,
        "TOKEN_EXPIRED",
        "Sesi Anda telah berakhir. Silahkan login kembali."
      );
    }

    console.error("Auth error:", error);
    return sendErrorResponse(
      res,
      500,
      "SERVER_ERROR",
      "Terjadi kesalahan pada server saat memverifikasi autentikasi."
    );
  }
});

/**
 * Middleware untuk otorisasi berdasarkan role
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Pastikan user sudah terautentikasi
    if (!req.user) {
      return sendErrorResponse(
        res,
        401,
        "AUTH_REQUIRED",
        "Anda harus login terlebih dahulu."
      );
    }

    // Cek apakah role user termasuk dalam roles yang diizinkan
    if (!roles.includes(req.user.role)) {
      return sendErrorResponse(
        res,
        403,
        "ACCESS_DENIED",
        `Anda tidak memiliki izin untuk mengakses fitur ini (role: ${req.user.role}).`
      );
    }

    next();
  };
};
