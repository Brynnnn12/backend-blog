const Joi = require("joi");

exports.roleSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/) // hanya huruf, angka, underscore
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.pattern.base":
        "Nama peran hanya boleh huruf, angka. Karakter seperti <, >, / tidak diperbolehkan.",
      "string.base": "Nama peran harus berupa teks",
      "string.empty": "Nama peran tidak boleh kosong",
      "string.min": "Nama peran minimal 3 karakter",
      "string.max": "Nama peran maksimal 30 karakter",
      "any.required": "Nama peran wajib diisi",
    }),
});
