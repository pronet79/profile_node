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
    heroSubheading: { type: String, default: '10+ years of experience building scalable SaaS platforms, ERP systems, APIs, real-time applications and AI-powered solutions using Laravel, PHP, Node.js and React.' },

    // About section (all editable from admin)
    aboutHeading: { type: String, default: 'An engineer who builds products, not just features.' },
    aboutParagraph2: { type: String, default: '' },
    specialization: { type: String, default: 'SaaS / ERP / APIs / AI / Real-Time Systems' },
    yearsExperience: { type: String, default: '10+ Years' },
    philosophy: { type: String, default: 'Pragmatic architecture, tested critical paths, and code the next developer can read.' },
    strengths: { type: String, default: 'Backend systems, API design, payments, real-time features and AI integration.' },

    // Animated stat counters (fully editable list)
    stats: {
      type: [{ value: String, suffix: String, label: String }],
      default: [
        { value: '10', suffix: '+', label: 'Years Experience' },
        { value: '50', suffix: '+', label: 'Successful Projects Shipped' },
        { value: '25', suffix: '+', label: 'Technologies & Tools' },
        { value: '6', suffix: '+', label: 'Business Domains' },
      ],
    },

    // "Have a Project in Mind?" CTA (shown where the donation block used to be)
    projectCtaHeading: { type: String, default: 'Have a Project in Mind?' },
    projectCtaText: { type: String, default: "Let's turn your idea into reliable, production-ready software. Tell me what you're building and I'll get back to you with next steps." },

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
