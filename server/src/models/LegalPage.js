import mongoose from 'mongoose';

/*
  Editable legal pages: Privacy, Terms, Payment/Refund.
  Identified by a fixed slug. Content is Markdown authored in the admin.
*/
const legalPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, enum: ['privacy', 'terms', 'payment-policy'], index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' }, // Markdown
  },
  { timestamps: true }
);

export const LegalPage = mongoose.model('LegalPage', legalPageSchema);
