import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    overview: { type: String },
    problem: { type: String },
    solution: { type: String },
    keyFeatures: [{ type: String }],
    technologies: [{ type: String }],
    role: { type: String },
    architecture: { type: String },
    deployment: { type: String },
    results: { type: String },
    coverImage: { type: String },
    screenshots: [{ type: String }],
    videoUrl: { type: String }, // YouTube URL (video hosted on YouTube, only the link is stored)
    githubUrl: { type: String },
    liveUrl: { type: String },
    caseStudy: { type: String },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.pre('validate', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title);
  }
  next();
});

export const Project = mongoose.model('Project', projectSchema);
