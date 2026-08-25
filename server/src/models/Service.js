import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'code' }, // lucide icon name
    tags: [{ type: String }],
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service = mongoose.model('Service', serviceSchema);
