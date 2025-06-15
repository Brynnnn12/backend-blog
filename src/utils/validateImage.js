const fs = require("fs");

exports.validateImage = (req) => {
  if (!req.file) {
    return "Gambar wajib diunggah";
  }
  if (!req.file.mimetype.startsWith("image/")) {
    return "File yang diunggah harus berupa gambar";
  }
  return null;
};

exports.deleteImage = (imagePath) => {
  try {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Berhasil menghapus file: ${imagePath}`);
    } else {
      console.log(`File tidak ditemukan: ${imagePath}`);
    }
  } catch (error) {
    console.error(`Error saat menghapus file ${imagePath}: ${error.message}`);
  }
};
