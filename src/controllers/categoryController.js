const asyncHandler = require("express-async-handler");
const { Category } = require("../models");
const { validateCategory } = require("../validations/categorySchema");
const { paginate } = require("../utils/paginate");
const { Op } = require("sequelize");
const { generateSlug } = require("../utils/slugGenerator");

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
  const { name } = validateCategory(req.body);

  // Cek jika kategori dengan nama sama sudah ada
  const existingCategory = await Category.findOne({ where: { name } });
  if (existingCategory) {
    return res.status(400).json({
      status: "fail",
      message: "Kategori dengan nama tersebut sudah ada",
    });
  }

  // Buat slug manual agar eksplisit dan konsisten
  const slug = generateSlug(name);

  // Buat kategori baru (slug akan otomatis digenerate via hook)
  const newCategory = await Category.create({ name, slug });

  return res.status(201).json({
    status: "success",
    message: "Kategori berhasil dibuat",
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
  const { name } = validateCategory(req.body);

  // Cari kategori berdasarkan slug
  const category = await Category.findOne({ where: { slug } });
  if (!category) {
    return res.status(404).json({
      status: "fail",
      message: "Kategori tidak ditemukan",
    });
  }

  // Cek duplikat nama (kecuali kategori yang sedang diupdate)
  const existingCategory = await Category.findOne({
    where: {
      name,
      id: { [Op.ne]: category.id },
    },
  });
  if (existingCategory) {
    return res.status(400).json({
      status: "fail",
      message: "Kategori dengan nama tersebut sudah ada",
    });
  }

  // Perbarui nama (slug akan ikut diperbarui via hook)
  category.name = name;
  category.slug = generateSlug(name); // Generate slug baru
  await category.save();

  return res.status(200).json({
    status: "success",
    message: "Kategori berhasil diperbarui",
    data: {
      id: category.id,
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
