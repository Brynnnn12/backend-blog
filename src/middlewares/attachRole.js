/* eslint-disable no-unused-vars */
const { Users, Roles } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      include: [{ model: Roles, as: "role", attributes: ["name"] }],
    });

    if (!user || !user.role) {
      return res.status(403).json({ message: "Role tidak ditemukan" });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Gagal memuat role user" });
  }
};
