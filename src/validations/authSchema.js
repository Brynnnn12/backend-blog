const Joi = require("joi");

exports.registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username harus berupa teks",
    "string.empty": "Username tidak boleh kosong",
    "string.min": "Username minimal {#limit} karakter",
    "string.max": "Username maksimal {#limit} karakter",
    "any.required": "Username wajib diisi",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email harus berupa teks",
    "string.empty": "Email tidak boleh kosong",
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password harus berupa teks",
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal {#limit} karakter",
    "any.required": "Password wajib diisi",
  }),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email harus berupa teks",
    "string.empty": "Email tidak boleh kosong",
    "string.email": "Email tidak valid",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password harus berupa teks",
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal {#limit} karakter",
    "any.required": "Password wajib diisi",
  }),
});
