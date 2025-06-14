const asyncHandler = require("express-async-handler");
const { Users } = require("../models");
const { updateProfileSchema } = require("../validations/profileSchema");

/**
 * Get user profile
 * @route GET /api/profile
 * @access Private
 */
exports.index = asyncHandler(async (req, res) => {
  const user = await Users.findByPk(req.user.id, {
    attributes: ["username", "email"],
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User tidak ditemukan",
    });
  }

  return res.status(200).json({
    status: "success",
    data: user,
  });
});

/**
 * Update user profile
 * @route PUT /api/profile
 * @access Private
 */
exports.update = asyncHandler(async (req, res) => {
  // Validasi input
  const { error, value } = updateProfileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { username, email, currentPassword, newPassword } = value;
  const user = await Users.findByPk(req.user.id);

  // Jika ingin update password, verifikasi password saat ini
  if (newPassword && currentPassword) {
    const isPasswordValid = await user.CorrectPassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Password saat ini tidak valid",
      });
    }
  }

  // Check jika username baru sudah dipakai
  if (username && username !== user.username) {
    const existingUsername = await Users.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        status: "fail",
        message: "Username sudah digunakan",
      });
    }
  }

  // Check jika email baru sudah dipakai
  if (email && email !== user.email) {
    const existingEmail = await Users.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({
        status: "fail",
        message: "Email sudah digunakan",
      });
    }
  }

  // Update data user
  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (newPassword) updateData.password = newPassword;

  await user.update(updateData);

  // Mengembalikan user yang sudah diupdate tanpa password
  const updatedUser = await Users.findByPk(user.id, {
    attributes: ["username", "email"],
  });

  return res.status(200).json({
    status: "success",
    message: "Profile berhasil diperbarui",
    data: updatedUser,
  });
});

/**
 * Delete user account
 * @route DELETE /api/profile
 * @access Private
 */
exports.destroy = asyncHandler(async (req, res) => {
  // Konfirmasi password sebelum menghapus akun
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      status: "fail",
      message: "Password diperlukan untuk verifikasi",
    });
  }

  const user = await Users.findByPk(req.user.id, {
    attributes: ["id", "password"],
  });

  // Verifikasi password
  const isPasswordValid = await user.CorrectPassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      status: "fail",
      message: "Password tidak valid",
    });
  }

  // Hapus user
  await user.destroy();

  // Clear cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    status: "success",
    message: "Akun berhasil dihapus",
  });
});
