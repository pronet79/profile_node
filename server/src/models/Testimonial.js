import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true },
    website: { type: String, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    avatar: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    ipHash: { type: String }, // for lightweight duplicate/abuse detection
  },
  { timestamps: true }
);

testimonialSchema.index({ email: 1, message: 1 }, { unique: false });

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
