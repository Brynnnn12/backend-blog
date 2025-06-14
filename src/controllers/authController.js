const asyncHandler = require("express-async-handler");
const { Users } = require("../models");
const { createSendToken } = require("../utils/jwtUtils");
const { registerSchema, loginSchema } = require("../validations/authSchema");

exports.register = asyncHandler(async (req, res) => {
  // ✅ Validasi request body pakai Joi
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message, // Ambil pesan error pertama
    });
  }

  // ✅ Destructuring dari value yang sudah tervalidasi
  const { username, email, password } = value;

  // Cek apakah email sudah terdaftar
  const existingUser = await Users.findOne({ where: { email } });
  if (existingUser) {
    return res
      .status(400)
      .json({ status: "fail", message: "Email sudah terdaftar" });
  }

  // Buat user baru
  const newUser = await Users.create({
    username,
    email,
    password,
  });

  return createSendToken(newUser, 201, res, "Registrasi berhasil");
});

exports.login = asyncHandler(async (req, res) => {
  // ✅ Validasi request body pakai Joi
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message, // Ambil pesan error pertama
    });
  }

  // ✅ Destructuring dari value yang sudah tervalidasi
  const { email, password } = value;

  // Cek apakah user ada
  const userLogin = await Users.findOne({ where: { email } });

  if (
    !userLogin ||
    !(await userLogin.CorrectPassword(password, userLogin.password))
  ) {
    return res
      .status(401)
      .json({ status: "fail", message: "Email atau password salah" });
  }

  return createSendToken(userLogin, 200, res, "Login berhasil");
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    status: "success",
    message: "Logout berhasil",
  });
});
