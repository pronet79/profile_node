import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    type: { type: String, enum: ['full-time', 'freelance', 'contract', 'part-time'], default: 'full-time' },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // null = current
    current: { type: Boolean, default: false },
    responsibilities: [{ type: String }],
    achievements: [{ type: String }],
    technologies: [{ type: String }],
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const Experience = mongoose.model('Experience', experienceSchema);
