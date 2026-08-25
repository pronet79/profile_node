import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: 'Anonymous Supporter' },
    email: { type: String, lowercase: true, trim: true },
    message: { type: String, trim: true, maxlength: 500 },
    amount: { type: Number, required: true, min: 1 }, // in major currency unit (INR)
    currency: { type: String, default: 'INR' },
    showPublicly: { type: Boolean, default: false },
    gateway: { type: String, default: 'razorpay' },
    orderId: { type: String, index: true },
    paymentId: { type: String },
    signature: { type: String },
    status: { type: String, enum: ['created', 'pending', 'successful', 'failed'], default: 'created', index: true },
  },
  { timestamps: true }
);

// Never store raw card/UPI credentials — enforced by schema shape (none exist here).

export const Donation = mongoose.model('Donation', donationSchema);
