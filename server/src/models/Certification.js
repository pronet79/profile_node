import mongoose from 'mongoose';

/*
  A single "Certification & Profile" entry. Two kinds:
   - category 'certification' → an earned credential (HackerRank, AI Career Accelerator, …)
   - category 'profile'       → an external coding/competitive profile (Codolio, LeetCode, …)
*/
const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },      // e.g. "HackerRank Skill Certificate"
    issuer: { type: String, trim: true, default: '' },        // e.g. "HackerRank", "Codolio"
    category: { type: String, enum: ['certification', 'profile'], default: 'certification', index: true },
    url: { type: String, required: true, trim: true },        // link to the credential / profile
    image: { type: String, default: '' },                     // optional badge/logo (Cloudinary URL)
    description: { type: String, default: '' },
    icon: { type: String, default: '' },                      // optional lucide icon name
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Certification = mongoose.model('Certification', certificationSchema);
