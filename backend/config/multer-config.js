const multer = require("multer");
const storage = multer.memoryStorage(); // Store file in memory before uploading to Cloudinary
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024, // 5 MB for fields like address
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  }
});

module.exports = upload;
