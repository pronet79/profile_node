import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Backend', 'Frontend', 'Database', 'APIs & Integrations', 'DevOps / Cloud', 'AI'],
      index: true,
    },
    name: { type: String, required: true, trim: true },
    icon: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Skill = mongoose.model('Skill', skillSchema);
