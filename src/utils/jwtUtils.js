/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");

// Membuat token JWT dari ID user
exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "3d",
  });
};

// Kirim token dalam bentuk cookie
exports.createSendToken = (user, statusCode, res, message = "Success") => {
  const token = exports.signToken(user.id);

  // Cek apakah sedang di development (localhost) atau production
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    maxAge:
      Number(process.env.JWT_COOKIE_EXPIRES_IN || 3) * 24 * 60 * 60 * 1000, // 3 hari
    httpOnly: true,
    secure: isProduction, // true jika HTTPS (production)
    sameSite: isProduction ? "None" : "Lax", // "None" agar bisa cross-site di production
  };

  // Set cookie ke browser
  res.cookie("jwt", token, cookieOptions);

  // Kirim response tanpa token di body
  res.status(statusCode).json({
    status: "success",
    message,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    },
  });
};

// Verifikasi token dari cookie
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};
