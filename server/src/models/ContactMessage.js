import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true },
    projectType: {
      type: String,
      enum: ['SaaS', 'ERP', 'Shopify', 'AI', 'API', 'Website', 'Mobile', 'Other'],
      default: 'Other',
    },
    budget: { type: String },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new', index: true },
    ipHash: { type: String },
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model('ContactMessage', contactSchema);
