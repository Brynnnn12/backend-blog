/* eslint-disable no-undef */
const asyncHandler = require("express-async-handler");
const { Posts, Users, Category } = require("../models");
const { postSchema } = require("../validations/postSchema");
const { paginate } = require("../utils/paginate");
const { Op } = require("sequelize");
const path = require("path");
const { validateImage, deleteImage } = require("../utils/validateImage");

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
exports.store = asyncHandler(async (req, res) => {
  const { error, value } = postSchema.validate(req.body);
  if (error) {
    // Hapus file yang sudah diupload jika validasi gagal
    if (req.file) {
      const imagePath = path.join(IMAGE_PATH, req.file.filename);
      deleteImage(imagePath);
    }
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, content, categoryId } = value;

  const existingPost = await Posts.findOne({ where: { title } });
  if (existingPost) {
    if (req.file) {
      // Hapus file yang sudah diupload jika judul sudah ada
      const imagePath = path.join(IMAGE_PATH, req.file.filename);
      deleteImage(imagePath);
    }
    return res.status(400).json({ message: "Judul postingan sudah digunakan" });
  }

  const categoryExists = await Category.findByPk(categoryId, {
    attributes: ["id", "name"],
  });
  if (!categoryExists) {
    if (req.file) {
      // Hapus file yang sudah diupload jika kategori tidak ditemukan
      const imagePath = path.join(IMAGE_PATH, req.file.filename);
      deleteImage(imagePath);
    }
    return res.status(404).json({
      status: "fail",
      message: "Kategori tidak ditemukan",
    });
  }

  const imageError = validateImage(req);
  if (imageError) {
    return res.status(400).json({
      status: "fail",
      message: imageError,
    });
  }

  const newPost = await Posts.create({
    title,
    content,
    image: req.file.filename,
    userId: req.user.id,
    categoryId,
  });

  return res.status(201).json({
    status: "success",
    message: "Postingan berhasil dibuat",
    data: {
      id: newPost.id,
      title: newPost.title,
      slug: newPost.slug,
      content: newPost.content,
      image: newPost.image,
      userId: newPost.userId,
      categoryId: newPost.categoryId,
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
    attributes: ["title", "slug", "content", "image", "createdAt", "updatedAt"],
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["id", "username"],
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name", "slug"],
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
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  const { title, content, categoryId } = value;

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
      message: "Anda tidak memiliki akses untuk mengubah postingan ini",
    });
  }

  // Cek kategori
  const categoryExists = await Category.findByPk(categoryId, {
    attributes: ["id", "name"],
  });
  if (!categoryExists) {
    // Hapus file baru yang gagal validasi
    if (req.file) {
      const newImagePath = path.join(IMAGE_PATH, req.file.filename);
      deleteImage(newImagePath);
    }
    return res.status(404).json({
      status: "fail",
      message: "Kategori tidak ditemukan",
    });
  }
  // Cek duplikat judul, kecuali judul sendiri
  if (title !== post.title) {
    const existingPost = await Posts.findOne({
      where: {
        title,
        id: { [Op.ne]: post.id },
      },
    });

    if (existingPost) {
      // Hapus file baru yang gagal validasi
      if (req.file) {
        const newImagePath = path.join(IMAGE_PATH, req.file.filename);
        deleteImage(newImagePath);
      }
      return res.status(400).json({
        status: "fail",
        message: "Judul postingan sudah digunakan",
      });
    }
  }

  // Update data post
  const updateData = { title, content, categoryId };

  // Handle gambar jika ada
  if (req.file) {
    const imageError = validateImage(req);
    if (imageError) {
      // Hapus file baru yang gagal validasi
      const newImagePath = path.join(IMAGE_PATH, req.file.filename);
      deleteImage(newImagePath);
      return res.status(400).json({
        status: "fail",
        message: imageError,
      });
    }

    // Hapus gambar lama jika ada
    if (post.image) {
      try {
        const oldImagePath = path.join(IMAGE_PATH, post.image);
        console.log(`Mencoba menghapus file lama: ${oldImagePath}`);
        deleteImage(oldImagePath);
      } catch (error) {
        console.error(`Gagal menghapus gambar lama: ${error.message}`);
        // Lanjutkan proses meskipun gagal menghapus
      }
    }

    updateData.image = req.file.filename;
  }

  // Update post
  // Update post
  await post.update(updateData, { validate: true });

  // Gunakan instance yang sama untuk response
  return res.status(200).json({
    status: "success",
    message: "Postingan berhasil diperbarui",
    data: {
      id: post.id,
      title: post.title,
      slug: post.slug, // Ambil slug dari instance yang diupdate
      content: post.content,
      image: post.image,
      updatedAt: post.updatedAt,
      category: post.category, // Mungkin perlu ambil category terpisah
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
