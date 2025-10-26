/**
 * Multer configuration for file uploads
 * Provides reusable upload factories and presets for images and documents.
 */

const fs = require('fs');
const path = require('path');
const multer = require('multer');

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const defaultUploadsDir = () =>
    path.resolve(process.cwd(), process.env.UPLOADS_DIR || 'uploads');

const createStorage = (destDir) => {
    const dir = destDir || defaultUploadsDir();
    ensureDir(dir);
    return multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, dir),
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname) || '';
            const base = path.basename(file.originalname, ext).replace(/[^a-z0-9-_]/gi, '_');
            const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            cb(null, `${base}_${unique}${ext.toLowerCase()}`);
        },
    });
};

const IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
];

const DOC_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const fileFilterFactory = (allowedMimeTypes) => (req, file, cb) => {
    if (!allowedMimeTypes || allowedMimeTypes.length === 0) return cb(null, true);
    if (allowedMimeTypes.includes(file.mimetype)) return cb(null, true);
    return cb(new Error(`Invalid file type: ${file.mimetype}`));
};

/**
 * Create a configured multer upload middleware
 * @param {Object} opts
 * @param {string[]} [opts.allowedMimeTypes]
 * @param {number} [opts.maxSizeMB] - per file limit in MB
 * @param {string} [opts.dest] - destination directory
 * @param {Object} [opts.limits] - additional multer limits
 * @returns {{ single: (field:string)=>any, array:(field:string,maxCount?:number)=>any, any:()=>any }}
 */
const createUploader = ({ allowedMimeTypes = [], maxSizeMB = 10, dest, limits = {} } = {}) => {
    const storage = createStorage(dest);
    const fileFilter = fileFilterFactory(allowedMimeTypes);
    const maxSize = Math.max(1, maxSizeMB) * 1024 * 1024;

    const uploader = multer({
        storage,
        fileFilter,
        limits: { fileSize: maxSize, ...limits },
    });

    return {
        single: (field) => uploader.single(field),
        array: (field, maxCount = 5) => uploader.array(field, maxCount),
        any: () => uploader.any(),
    };
};

// Presets
const uploadImage = createUploader({ allowedMimeTypes: IMAGE_MIME_TYPES, maxSizeMB: 5 });
const uploadDocument = createUploader({ allowedMimeTypes: DOC_MIME_TYPES, maxSizeMB: 15 });
const uploadResume = uploadDocument; // alias

module.exports = {
    createUploader,
    uploadImage,
    uploadDocument,
    uploadResume,
    IMAGE_MIME_TYPES,
    DOC_MIME_TYPES,
};

