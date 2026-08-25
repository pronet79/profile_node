import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];
const DOC_TYPES = ['application/pdf'];
const IMAGE_MAX = 5 * 1024 * 1024;   // 5MB
const DOC_MAX = 10 * 1024 * 1024;    // 10MB

function makeUploader(allowed, maxBytes) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes },
    fileFilter: (_req, file, cb) => {
      if (!allowed.includes(file.mimetype)) return cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
      cb(null, true);
    },
  }).single('file');
}

const imageUploader = makeUploader(IMAGE_TYPES, IMAGE_MAX);
const docUploader = makeUploader(DOC_TYPES, DOC_MAX);

function wrap(uploader, maxLabel) {
  return (req, res, next) => {
    uploader(req, res, (err) => {
      if (err) {
        const msg = err.code === 'LIMIT_FILE_SIZE' ? `File too large (max ${maxLabel})` : err.message;
        return next(new ApiError(400, msg));
      }
      next();
    });
  };
}

export const handleImageUpload = wrap(imageUploader, '5MB');
export const handleDocumentUpload = wrap(docUploader, '10MB');
