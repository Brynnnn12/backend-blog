const asyncHandler = require("express-async-handler");
const { Category } = require("../models");
const { categorySchema } = require("../validations/categorySchema");
const { paginate } = require("../utils/paginate");
const { Op } = require("sequelize");

/**
 * Get all category
 * @route GET /api/category
 * @access Public
 */
exports.index = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await paginate({
    model: Category,
    page,
    limit,
    attributes: ["id", "name", "slug"],
  });

  return res.status(200).json({
    status: "success",
    message: "Kategori berhasil diambil",
    ...result,
  });
});

/**
 * Create a new category
 * @route POST /api/categories
 * @access Private
 */
exports.store = asyncHandler(async (req, res) => {
  const { error, value } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name } = value;

  const existingCategory = await Category.findOne({ where: { name } });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const newCategory = await Category.create({ name });

  return res.status(201).json({
    status: "success",
    message: "Kategori Berhasil dibuat",
    data: {
      name: newCategory.name,
      slug: newCategory.slug,
    },
  });
});

/**
 * Update a category
 * @route PUT /api/categories/:slug
 * @param {string} slug - The slug of the category to update
 * @access Private
 */

exports.update = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { error, value } = categorySchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name } = value;

  // Cari kategori berdasarkan slug
  const category = await Category.findOne({ where: { slug } });
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Cek duplikat nama
  const existingCategory = await Category.findOne({
    where: { name, id: { [Op.ne]: category.id } },
  });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  // Update kategori (slug akan otomatis diperbarui oleh hook)
  await category.update({ name }, { validate: true });

  return res.status(200).json({
    status: "success",
    message: "Kategori berhasil diupdate",
    data: {
      name: category.name,
      slug: category.slug,
    },
  });
});

/**
 * Delete a category
 * @route DELETE /api/categories/:slug
 * @param {string} slug - The slug of the category to delete
 * @access Private
 */
exports.destroy = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({
    where: { slug },
    attributes: ["id"],
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await category.destroy();

  return res.status(200).json({
    status: "success",
    message: "Kategori berhasil dihapus",
  });
});
