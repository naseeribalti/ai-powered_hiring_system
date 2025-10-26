// config/cloudinary.js - Cloudinary File Upload Configuration
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// File Upload Configuration
const fileConfig = {
    // Allowed file types and sizes
    allowedFormats: {
        images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'],
        documents: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
        resumes: ['pdf', 'doc', 'docx'],
        all: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt']
    },

    maxFileSize: {
        images: 5 * 1024 * 1024, // 5MB
        documents: 10 * 1024 * 1024, // 10MB
        resumes: 5 * 1024 * 1024, // 5MB
        default: 5 * 1024 * 1024 // 5MB
    },

    // Cloudinary upload presets
    uploadPresets: {
        profilePictures: {
            folder: 'ai-hiring-system/profile-pictures',
            transformation: [
                { width: 300, height: 300, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' }
            ],
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
        },
        resumes: {
            folder: 'ai-hiring-system/resumes',
            resource_type: 'raw',
            allowed_formats: ['pdf', 'doc', 'docx'],
            format: '', // Keep original format
        },
        companyLogos: {
            folder: 'ai-hiring-system/company-logos',
            transformation: [
                { width: 200, height: 200, crop: 'fill' },
                { quality: 'auto', fetch_format: 'auto' }
            ],
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
        },
        jobAttachments: {
            folder: 'ai-hiring-system/job-attachments',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
        },
        default: {
            folder: 'ai-hiring-system/uploads',
            resource_type: 'auto',
        }
    },

    // Multer storage configuration for Cloudinary
    createStorage: (preset = 'default') => {
        const presetConfig = fileConfig.uploadPresets[preset] || fileConfig.uploadPresets.default;

        return new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: presetConfig.folder,
                format: async (req, file) => {
                    const ext = file.originalname.split('.').pop().toLowerCase();
                    return presetConfig.allowed_formats?.includes(ext) ? ext : undefined;
                },
                resource_type: presetConfig.resource_type || 'auto',
                transformation: presetConfig.transformation,
                public_id: (req, file) => {
                    const timestamp = Date.now();
                    const originalName = file.originalname.split('.')[0];
                    const userId = req.user?.id || 'anonymous';
                    return `${originalName}-${userId}-${timestamp}`;
                }
            }
        });
    },

    // File validation utility
    validateFile: (file, fileType = 'all') => {
        const allowedFormats = fileConfig.allowedFormats[fileType] || fileConfig.allowedFormats.all;
        const maxSize = fileConfig.maxFileSize[fileType] || fileConfig.maxFileSize.default;

        const fileExtension = file.originalname.split('.').pop().toLowerCase();

        if (!allowedFormats.includes(fileExtension)) {
            return {
                valid: false,
                error: `Invalid file type. Allowed types: ${allowedFormats.join(', ')}`
            };
        }

        if (file.size > maxSize) {
            return {
                valid: false,
                error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
            };
        }

        return { valid: true };
    },

    // Utility methods for Cloudinary operations
    deleteFile: async (publicId, resourceType = 'image') => {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType
            });
            return result;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error deleting file from Cloudinary:', error);
            throw error;
        }
    },

    generateUrl: (publicId, transformation = []) => {
        return cloudinary.url(publicId, {
            transformation: transformation,
            secure: true
        });
    },

    // Test Cloudinary connection
    testConnection: async () => {
        try {
            await cloudinary.api.ping();
            // eslint-disable-next-line no-console
            console.log('✅ Cloudinary connection successful');
            return true;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('❌ Cloudinary connection failed:', error.message);
            return false;
        }
    }
};

module.exports = {
    cloudinary,
    fileConfig
};

