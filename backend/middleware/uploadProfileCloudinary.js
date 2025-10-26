const multer = require('multer');
const { fileConfig } = require('../../config/cloudinary');

// Cloudinary-backed multer storage for profile pictures
const storage = fileConfig.createStorage('profilePictures');

const uploadProfilePhoto = multer({ storage });

module.exports = uploadProfilePhoto;
