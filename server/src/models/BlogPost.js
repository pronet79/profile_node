import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    category: {
      type: String,
      enum: ['Laravel', 'PHP', 'React', 'Node.js', 'AI', 'SaaS', 'Shopify', 'APIs', 'DevOps'],
      default: 'SaaS',
      index: true,
    },
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    readMinutes: { type: Number, default: 4 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.pre('validate', function (next) {
  if (this.isModified('title') || !this.slug) this.slug = slugify(this.title);
  if (this.published && !this.publishedAt) this.publishedAt = new Date();
  next();
});

export const BlogPost = mongoose.model('BlogPost', blogSchema);
