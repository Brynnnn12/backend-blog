const slugify = require("slugify");

/**
 * Generate slug dari string (nama, judul, dll)
 * @param {string} text - Teks sumber
 * @returns {string} slug - Hasil slug
 */
exports.generateSlug = (text) => {
  // Gunakan slugify untuk membuat slug
  const slug = slugify(text, {
    lower: true, // Buat huruf kecil
    strict: true, // Hapus karakter non-alfanumerik
    trim: true, // Hapus spasi di awal/akhir
  });

  return slug;
};
