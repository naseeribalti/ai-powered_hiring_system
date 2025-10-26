const User = require('../models/User');

/**
 * Upload/Update profile photo for the current user
 * Expects multer (CloudinaryStorage) to provide req.file
 */
const uploadProfilePhoto = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // CloudinaryStorage provides URL in file.path and public_id in file.filename
        const photoUrl = req.file.path;
        const publicId = req.file.filename; // formatted by our storage public_id function

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatarUrl: photoUrl, avatarPublicId: publicId },
            { new: true }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Profile photo updated',
            data: { user }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    uploadProfilePhoto,
};

