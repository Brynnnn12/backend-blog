const Joi = require("joi");

exports.postSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Judul harus berupa teks",
    "string.empty": "Judul tidak boleh kosong",
    "string.min": "Judul minimal {#limit} karakter",
    "string.max": "Judul maksimal {#limit} karakter",
    "any.required": "Judul wajib diisi",
  }),
  content: Joi.string().min(10).required().messages({
    "string.base": "Konten harus berupa teks",
    "string.empty": "Konten tidak boleh kosong",
    "string.min": "Konten minimal {#limit} karakter",
    "any.required": "Konten wajib diisi",
  }),
  //validasi pakai uuid untuk categoryId
  categoryId: Joi.string().uuid().required().messages({
    "string.base": "ID Kategori harus berupa teks",
    "string.empty": "ID Kategori tidak boleh kosong",
    "string.uuid": "ID Kategori harus dalam format UUID yang valid",
    "any.required": "ID Kategori wajib diisi",
  }),
});
