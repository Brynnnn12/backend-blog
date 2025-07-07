const asyncHandler = require("express-async-handler");
const { Comments, Users, Posts } = require("../models");
const { paginate } = require("../utils/paginate");
const { validateComment } = require("../validations/coomentSchema");

/**
 * index - Retrieve all comments with associated user and post data.
 * @route GET /comments
 * @returns {Array} Array of comments with user and post details.
 */
exports.index = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Cari post berdasarkan slug
  const post = await Posts.findOne({ where: { slug } });
  if (!post) {
    return res.status(404).json({
      status: "error",
      message: "Postingan tidak ditemukan",
    });
  }

  const result = await paginate({
    model: Comments,
    page,
    limit,
    where: { postId: post.id },
    attributes: ["id", "content", "createdAt"],
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["id", "username"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({
    status: "success",
    message: "Komentar berhasil diambil",
    ...result,
  });
});

/**
 * @swagger
 * /comments:
 * *   get:
 */

exports.allComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Ambil semua komentar tanpa filter postId
  // Ini akan mengambil semua komentar yang ada di database

  const result = await paginate({
    model: Comments,
    page,
    limit,
    attributes: ["id", "content", "createdAt"],
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["username"],
      },
      {
        model: Posts,
        as: "post",
        attributes: ["title"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({
    status: "success",
    message: "Komentar berhasil diambil",
    ...result,
  });
});

/**
 * store - Create a new comment.
 * @route POST /comments
 * @param {Object} req.body - The comment data.
 * @returns {Object} The created comment with user and post details.
 */
exports.store = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { content } = req.body; // Hanya ambil content, postId dari slug

  // Validasi content
  if (!content || content.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Konten komentar wajib diisi",
    });
  }

  // Cari post berdasarkan slug
  const post = await Posts.findOne({ where: { slug } });
  if (!post) {
    return res.status(404).json({
      status: "error",
      message: "Postingan tidak ditemukan",
    });
  }

  const comment = await Comments.create({
    content: content.trim(),
    postId: post.id, // Otomatis dari slug
    userId: req.user.id,
  });

  const newComment = await Comments.findByPk(comment.id, {
    attributes: ["id", "content", "createdAt"],
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["id", "username"],
      },
    ],
  });

  return res.status(201).json({
    status: "success",
    message: "Komentar berhasil dibuat",
    data: newComment,
  });
});

/**
 * show - Retrieve a specific comment by ID.
 * @route GET /comments/:id
 * @param {string} req.params.id - The ID of the comment.
 * @returns {Object} The comment with user and post details.
 */
exports.show = asyncHandler(async (req, res) => {
  const comment = await Comments.findByPk(req.params.id, {
    attributes: ["id", "content", "createdAt"],
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["username", "email"],
      },
      {
        model: Posts,
        as: "post",
        attributes: ["title"],
      },
    ],
  });

  if (!comment) {
    return res.status(404).json({
      status: "error",
      message: "Komentar tidak ditemukan",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Komentar berhasil diambil",
    data: comment,
  });
});

/**
 * update - Update a specific comment by ID.
 * @route PUT /comments/:id
 * @param {string} req.params.id - The ID of the comment.
 * @param {Object} req.body - The updated comment data.
 * @returns {Object} The updated comment with user and post details.
 */
exports.update = asyncHandler(async (req, res) => {
  const { content } = validateComment(req.body);

  const comment = await Comments.findByPk(req.params.id);
  if (!comment) {
    return res.status(404).json({
      status: "error",
      message: "Komentar tidak ditemukan",
    });
  }

  // Check if the user is the owner of the comment
  if (comment.userId !== req.user.id) {
    return res.status(403).json({
      status: "error",
      message: "Anda tidak memiliki izin untuk mengedit komentar ini",
    });
  }

  comment.content = content;
  await comment.save();

  const updatedComment = await Comments.findByPk(comment.id, {
    attributes: ["id", "content", "createdAt"],
    include: [
      {
        model: Users,
        as: "user",
        attributes: ["username"],
      },
      {
        model: Posts,
        as: "post",
        attributes: ["title"],
      },
    ],
  });

  return res.status(200).json({
    status: "success",
    message: "Komentar berhasil diperbarui",
    data: updatedComment,
  });
});

/**
 * destroy - Delete a specific comment by ID.
 * @route DELETE /comments/:id
 * @param {string} req.params.id - The ID of the comment.
 * @returns {Object} Confirmation message.
 */
exports.destroy = asyncHandler(async (req, res) => {
  const comment = await Comments.findByPk(req.params.id);
  if (!comment) {
    return res.status(404).json({
      status: "error",
      message: "Komentar tidak ditemukan",
    });
  }

  // Check if the user is the owner of the comment
  if (comment.userId !== req.user.id) {
    return res.status(403).json({
      status: "error",
      message: "Anda tidak memiliki izin untuk menghapus komentar ini",
    });
  }

  await comment.destroy();

  return res.status(200).json({
    status: "success",
    message: "Komentar berhasil dihapus",
  });
});
