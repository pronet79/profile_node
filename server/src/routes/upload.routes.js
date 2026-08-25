import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { handleImageUpload, handleDocumentUpload } from '../middleware/upload.js';
import { uploadImage, uploadDocument } from '../controllers/upload.controller.js';

const router = Router();
// Admin-only. Images go to Cloudinary; documents (resume) stay on this server.
router.post('/', protect, handleImageUpload, uploadImage);          // POST /api/uploads
router.post('/image', protect, handleImageUpload, uploadImage);      // explicit alias
router.post('/document', protect, handleDocumentUpload, uploadDocument); // POST /api/uploads/document
export default router;
