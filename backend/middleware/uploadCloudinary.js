const multer = require('multer');
const { fileConfig } = require('../../config/cloudinary');

// Cloudinary-backed multer storage for resumes
const storage = fileConfig.createStorage('resumes');

const uploadResumeCloud = multer({ storage });

module.exports = uploadResumeCloud;
