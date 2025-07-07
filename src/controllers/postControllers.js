/* eslint-disable no-undef */
const asyncHandler = require("express-async-handler");
const { Posts, Users, Category } = require("../models");
const { postSchema } = require("../validations/postSchema");
const { paginate } = require("../utils/paginate");
const { Op } = require("sequelize");
const path = require("path");
const { validateImage, deleteImage } = require("../utils/validateImage");
const { generateSlug } = require("../utils/slugGenerator");

const IMAGE_PATH = path.join(__dirname, "../public/uploads/posts");
/**
 * @desc Get all posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.index = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await paginate({
    model: Posts,
    page,
    limit,
    attributes: ["id", "title", "slug", "content", "image"],
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["username"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["name"],
      },
    ],
  });
  return res.status(200).json({
    status: "success",
    message: "Postingan berhasil diambil",
    ...result,
  });
});
/**
 * @desc Create a new post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

/**
 * @desc Get user's posts (PRIVATE - untuk dashboard)
 * @route GET /api/posts/my-posts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getMyPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const userId = req.user.id;

  // Filter berdasarkan user dan search jika ada
  let whereClause = { userId };

  if (search) {
    whereClause = {
      ...whereClause,
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
      ],
    };
  }

  const result = await paginate({
    model: Posts,
    page,
    limit,
    where: whereClause,
    attributes: [
      "id",
      "title",
      "slug",
      "content",
      "image",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({
    status: "success",
    message: "Postingan Anda berhasil diambil",
    ...result,
  });
});

exports.store = asyncHandler(async (req, res) => {
  const { error, value } = postSchema.validate(req.body);

  if (error) {
    if (req.file) deleteImage(path.join(IMAGE_PATH, req.file.filename));
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, content, categoryId } = value;

  const [existingPost, categoryExists] = await Promise.all([
    Posts.findOne({ where: { title } }),
    Category.findByPk(categoryId, { attributes: ["id", "name"] }),
  ]);

  if (existingPost) {
    if (req.file) deleteImage(path.join(IMAGE_PATH, req.file.filename));
    return res.status(400).json({ message: "Judul postingan sudah digunakan" });
  }

  if (!categoryExists) {
    if (req.file) deleteImage(path.join(IMAGE_PATH, req.file.filename));
    return res.status(404).json({ message: "Kategori tidak ditemukan" });
  }

  const imageError = validateImage(req);
  if (imageError) {
    if (req.file) deleteImage(path.join(IMAGE_PATH, req.file.filename));
    return res.status(400).json({ message: imageError });
  }

  const newPost = await Posts.create({
    title,
    slug: generateSlug(title),
    content,
    image: req.file.filename,
    userId: req.user.id,
    categoryId,
  });

  return res.status(201).json({
    status: "success",
    message: "Postingan berhasil dibuat",
    data: {
      title: newPost.title,
      content: newPost.content,
      image: newPost.image,
    },
  });
});

/**
 * @desc Get a post by slug
 * @route GET /api/posts/:slug
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.show = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const post = await Posts.findOne({
    where: { slug },
    attributes: ["title", "content", "image", "createdAt", "updatedAt"],
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["username"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["name"],
      },
    ],
  });

  if (!post) {
    return res.status(404).json({
      status: "fail",
      message: "Postingan tidak ditemukan",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Postingan berhasil diambil",
    data: post,
  });
});

/**
 * @desc Update a post
 * @route PUT /api/posts/:slug
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.update = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { error, value } = postSchema.validate(req.body);

  if (error) {
    if (req.file) deleteImage(path.join(IMAGE_PATH, req.file.filename));
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, content, categoryId } = value;

  const post = await Posts.findOne({ where: { slug } });
  if (!post) {
    if (req.file) deleteImage(path.join(IMAGE_PATH, req.file.filename));
    return res.status(404).json({ message: "Postingan tidak ditemukan" });
  }

  if (post.userId !== req.user.id) {
    if (req.file) deleteImage(path.join(IMAGE_PATH, req.file.filename));
    return res.status(403).json({ message: "Anda tidak memiliki akses" });
  }

  const [existingPost, categoryExists] = await Promise.all([
    title !== post.title
      ? Posts.findOne({ where: { title, id: { [Op.ne]: post.id } } })
      : null,
    Category.findByPk(categoryId),
  ]);

  if (existingPost) {
    if (req.file) deleteImage(path.join(IMAGE_PATH, req.file.filename));
    return res.status(400).json({ message: "Judul postingan sudah digunakan" });
  }

  if (!categoryExists) {
    if (req.file) deleteImage(path.join(IMAGE_PATH, req.file.filename));
    return res.status(404).json({ message: "Kategori tidak ditemukan" });
  }

  if (req.file) {
    const imageError = validateImage(req);
    if (imageError) {
      deleteImage(path.join(IMAGE_PATH, req.file.filename));
      return res.status(400).json({ message: imageError });
    }

    // Hapus gambar lama jika ada
    if (post.image) {
      try {
        deleteImage(path.join(IMAGE_PATH, post.image));
      } catch (e) {
        console.error("Gagal hapus gambar lama:", e.message);
      }
    }

    post.image = req.file.filename;
  }

  post.title = title;
  post.slug = generateSlug(title); // Update slug jika title berubah
  post.content = content;
  post.categoryId = categoryId;

  await post.save(); // akan trigger `beforeSave` untuk update slug jika title berubah

  return res.status(200).json({
    status: "success",
    message: "Postingan berhasil diperbarui",
    data: {
      title: post.title,
      slug: post.slug,
      content: post.content,
      image: post.image,
      updatedAt: post.updatedAt,
    },
  });
});

/**
 * @desc Delete a post
 * @route DELETE /api/posts/:slug
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.destroy = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Cari post berdasarkan slug
  const post = await Posts.findOne({ where: { slug } });
  if (!post) {
    return res.status(404).json({
      status: "fail",
      message: "Postingan tidak ditemukan",
    });
  }

  // Verifikasi pemilik post
  if (post.userId !== req.user.id) {
    return res.status(403).json({
      status: "fail",
      message: "Anda tidak memiliki akses untuk menghapus postingan ini",
    });
  }

  // Hapus gambar terkait jika ada
  if (post.image) {
    try {
      const imagePath = path.join(IMAGE_PATH, post.image);
      console.log(`Mencoba menghapus file: ${imagePath}`);
      deleteImage(imagePath);
    } catch (error) {
      console.error(`Gagal menghapus gambar: ${error.message}`);
      // Lanjutkan proses destroy meskipun gambar gagal dihapus
    }
  }
  // Hapus post
  await post.destroy();

  return res.status(200).json({
    status: "success",
    message: "Postingan berhasil dihapus",
  });
});
