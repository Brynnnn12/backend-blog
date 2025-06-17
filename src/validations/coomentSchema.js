const Joi = require("joi");

exports.commentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required().messages({
    "string.base": "Konten komentar harus berupa teks",
    "string.empty": "Konten komentar tidak boleh kosong",
    "string.min": "Komentar harus setidaknya 1 karakter",
    "string.max": "Komentar tidak boleh lebih dari 500 karakter",
    "any.required": "Konten komentar wajib diisi",
  }),
  postId: Joi.string().uuid().required().messages({
    "string.base": "ID postingan harus berupa UUID",
    "string.uuid": "ID postingan harus dalam format UUID yang valid",
    "any.required": "ID postingan wajib diisi",
  }),
  userId: Joi.string().uuid().required().messages({
    "string.base": "ID pengguna harus berupa UUID",
    "string.uuid": "ID pengguna harus dalam format UUID yang valid",
    "any.required": "ID pengguna wajib diisi",
  }),
});

exports.validateComment = (data) => {
  const { error } = exports.commentSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return true;
};
