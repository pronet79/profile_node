import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/*
  Storage service with two clear responsibilities:

  - IMAGES  → Cloudinary when configured (the stored value is Cloudinary's
              secure_url). Falls back to local disk only in development so the
              app still works without an account; a warning is logged.
  - DOCUMENTS (e.g. the resume PDF) → ALWAYS stored on this server's own disk
              under /uploads, never a third-party service.

  Local files are written to <cwd>/uploads and served at /uploads/<name>.
*/

const LOCAL_DIR = path.resolve(process.cwd(), 'uploads');

if (env.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
}

function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });
}

function cloudinaryUpload(buffer, resourceType = 'image') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: env.cloudinary.folder, resource_type: resourceType },
      (err, result) =>
        err ? reject(err) : resolve({ url: result.secure_url, publicId: result.public_id, provider: 'cloudinary' })
    );
    stream.end(buffer);
  });
}

function localUpload(buffer, originalName, fallbackExt = '.bin') {
  ensureLocalDir();
  const ext = (path.extname(originalName) || fallbackExt).toLowerCase();
  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  fs.writeFileSync(path.join(LOCAL_DIR, name), buffer);
  // Relative URL by default (works via the Vite dev proxy and same-origin prod).
  // If PUBLIC_URL is explicitly set (split-origin deploy) emit an absolute URL.
  const base = process.env.PUBLIC_URL ? env.publicUrl.replace(/\/$/, '') : '';
  return { url: `${base}/uploads/${name}`, publicId: name, provider: 'local' };
}

export const storageService = {
  imageDriver() {
    return env.cloudinary.enabled ? 'cloudinary' : 'local';
  },
  localDir() {
    return LOCAL_DIR;
  },

  // Images: Cloudinary when configured, else local (dev fallback).
  async uploadImage(buffer, originalName = 'image.png') {
    if (env.cloudinary.enabled) return cloudinaryUpload(buffer, 'image');
    logger.warn('Cloudinary not configured — storing image on local disk (dev fallback).');
    return localUpload(buffer, originalName, '.png');
  },

  // Documents (resume, etc.): always this server's disk.
  async uploadDocument(buffer, originalName = 'file.pdf') {
    return localUpload(buffer, originalName, '.pdf');
  },

  async destroy(publicId, provider) {
    try {
      if (provider === 'cloudinary' && env.cloudinary.enabled) {
        await cloudinary.uploader.destroy(publicId);
      } else {
        const p = path.join(LOCAL_DIR, publicId);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
    } catch (e) {
      logger.warn(`storage destroy failed: ${e.message}`);
    }
  },
};
