const { Op } = require("sequelize");
const { Roles } = require("../models");
const { validateRole } = require("../validations/roleSchema");
const asyncHandler = require("express-async-handler");
const { paginate } = require("../utils/paginate");

/**
 * Get all paginated roles
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.index = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await paginate({
    model: Roles,
    page,
    limit,
    attributes: ["name"],
  });

  return res.status(200).json({
    message: "Roles fetched successfully",
    ...result,
  });
});
/**
 * Create a new role
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.store = asyncHandler(async (req, res) => {
  const { name } = validateRole(req.body);

  const existingRole = await Roles.findOne({ where: { name } });
  if (existingRole) {
    return res.status(400).json({ message: "Role already exists" });
  }

  const newRole = await Roles.create({ name });

  return res.status(201).json({
    message: "Role created successfully",
    data: newRole,
  });
});

/**
 * Update an existing role
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { name } = validateRole(req.body);

  const role = await Roles.findByPk(id);
  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  const existingRole = await Roles.findOne({
    where: { name, id: { [Op.ne]: id } },
  });

  if (existingRole) {
    return res.status(400).json({ message: "Role name already exists" });
  }

  await role.update({ name });

  return res.status(200).json({
    message: "Role updated successfully",
    data: role,
  });
});

/**
 * Delete a role
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.destroy = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Roles.findByPk(id);
  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  await role.destroy();

  return res.status(200).json({
    message: "Role deleted successfully",
  });
});
