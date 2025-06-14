/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");

// Fungsi untuk menandatangani (membuat) token JWT berdasarkan ID pengguna
exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Contoh: "4h"
  });
};

// Fungsi untuk membuat dan mengirim token ke client sebagai cookie
exports.createSendToken = (user, statusCode, res, message) => {
  const token = exports.signToken(user.id);

  const cookieOptions = {
    maxAge: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000, // dalam milidetik
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      username: user.username,
      email: user.email,
    },
  });
};

// Fungsi untuk memverifikasi token JWT
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
