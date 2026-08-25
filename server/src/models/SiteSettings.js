import mongoose from 'mongoose';

/* Single-document collection holding editable site-wide settings. */
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'primary', unique: true },
    name: { type: String, default: 'Pradosh Mukherjee' },
    role: { type: String, default: 'Senior Full-Stack Developer' },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    location: { type: String, default: 'Kolkata, India' },
    profilePhoto: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    heroHeading: { type: String, default: 'Senior Full-Stack Developer Turning Complex Business Problems Into Production-Ready Software.' },
    heroSubheading: { type: String, default: '' },
    social: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      fiverr: { type: String, default: '' },
    },
    donationEnabled: { type: Boolean, default: true },
    seo: {
      defaultTitle: { type: String, default: 'Pradosh Mukherjee — Senior Full-Stack Developer' },
      defaultDescription: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    analyticsId: { type: String, default: '' },
  },
  { timestamps: true }
);

settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: 'primary' });
  if (!doc) doc = await this.create({ key: 'primary' });
  return doc;
};

export const SiteSettings = mongoose.model('SiteSettings', settingsSchema);
