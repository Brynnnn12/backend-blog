const Joi = require("joi");

exports.categorySchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/) // hanya huruf, dan spasi
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "Nama kategori harus berupa teks",
      "string.empty": "Nama kategori tidak boleh kosong",
      "string.pattern.base":
        "Nama kategori hanya boleh mengandung huruf dan spasi",
      "string.min": "Nama kategori minimal {#limit} karakter",
      "string.max": "Nama kategori maksimal {#limit} karakter",
      "any.required": "Nama kategori wajib diisi",
    }),
});

exports.validateCategory = (data) => {
  const { error, value } = exports.categorySchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};
