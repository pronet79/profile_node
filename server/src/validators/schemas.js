import { z } from 'zod';

const email = z.string().email('A valid email is required').max(200);
const nonEmpty = (label, max = 200) => z.string().trim().min(1, `${label} is required`).max(max);

// Date helpers: form inputs arrive as strings (or '' when blank). Convert '' →
// undefined so blank optional dates don't fail coercion, and give clean messages.
const toDate = (v) => {
  if (v === '' || v === null || v === undefined) return undefined;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d; // keep original if invalid → triggers a clear error
};
const requiredDate = (label) =>
  z.preprocess(toDate, z.date({ required_error: `${label} is required`, invalid_type_error: `${label} is invalid` }));
const optionalDate = z.preprocess(toDate, z.date().optional());

export const loginSchema = z.object({
  email,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const testimonialSchema = z.object({
  name: nonEmpty('Name', 120),
  email,
  company: z.string().trim().max(160).optional().or(z.literal('')),
  website: z.string().trim().url('Website must be a valid URL').max(300).optional().or(z.literal('')),
  rating: z.coerce.number().int().min(1).max(5),
  message: nonEmpty('Feedback', 2000),
  avatar: z.string().url().optional().or(z.literal('')),
});

export const contactSchema = z.object({
  name: nonEmpty('Name', 120),
  email,
  company: z.string().trim().max(160).optional().or(z.literal('')),
  projectType: z.enum(['SaaS', 'ERP', 'Shopify', 'AI', 'API', 'Website', 'Mobile', 'Other']).default('Other'),
  budget: z.string().max(60).optional().or(z.literal('')),
  message: nonEmpty('Message', 5000),
});

export const donationOrderSchema = z.object({
  name: z.string().trim().max(120).optional().or(z.literal('')),
  email: email.optional().or(z.literal('')),
  message: z.string().trim().max(500).optional().or(z.literal('')),
  amount: z.coerce.number().min(1, 'Amount must be at least 1').max(1000000),
  showPublicly: z.coerce.boolean().default(false),
});

export const donationVerifySchema = z.object({
  orderId: nonEmpty('orderId', 120),
  paymentId: nonEmpty('paymentId', 120),
  signature: nonEmpty('signature', 300),
});

export const projectSchema = z.object({
  title: nonEmpty('Title', 200),
  category: z.string().max(80).optional().or(z.literal('')),
  shortDescription: z.string().max(400).optional().or(z.literal('')),
  overview: z.string().optional().or(z.literal('')),
  problem: z.string().optional().or(z.literal('')),
  solution: z.string().optional().or(z.literal('')),
  keyFeatures: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  role: z.string().optional().or(z.literal('')),
  architecture: z.string().optional().or(z.literal('')),
  deployment: z.string().optional().or(z.literal('')),
  results: z.string().optional().or(z.literal('')),
  coverImage: z.string().optional().or(z.literal('')),
  screenshots: z.array(z.string()).optional(),
  videoUrl: z.string().optional().or(z.literal('')),
  githubUrl: z.string().optional().or(z.literal('')),
  liveUrl: z.string().optional().or(z.literal('')),
  caseStudy: z.string().optional().or(z.literal('')),
  featured: z.coerce.boolean().optional(),
  order: z.coerce.number().optional(),
  published: z.coerce.boolean().optional(),
});

export const experienceSchema = z.object({
  company: nonEmpty('Company', 160),
  position: nonEmpty('Position', 160),
  location: z.string().optional().or(z.literal('')),
  type: z.enum(['full-time', 'freelance', 'contract', 'part-time']).default('full-time'),
  startDate: requiredDate('Start date'),
  endDate: optionalDate,
  current: z.coerce.boolean().optional(),
  responsibilities: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  order: z.coerce.number().optional(),
}).transform((data) => {
  // A current role never keeps an end date.
  if (data.current) data.endDate = undefined;
  return data;
});

export const serviceSchema = z.object({
  title: nonEmpty('Title', 120),
  description: nonEmpty('Description', 600),
  icon: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  order: z.coerce.number().optional(),
  published: z.coerce.boolean().optional(),
});

export const skillSchema = z.object({
  category: z.enum(['Backend', 'Frontend', 'Database', 'APIs & Integrations', 'DevOps / Cloud', 'AI']),
  name: nonEmpty('Name', 80),
  icon: z.string().optional().or(z.literal('')),
  order: z.coerce.number().optional(),
});

export const blogSchema = z.object({
  title: nonEmpty('Title', 200),
  excerpt: z.string().max(400).optional().or(z.literal('')),
  content: nonEmpty('Content', 100000),
  coverImage: z.string().optional().or(z.literal('')),
  category: z.enum(['Laravel', 'PHP', 'React', 'Node.js', 'AI', 'SaaS', 'Shopify', 'APIs', 'DevOps']).default('SaaS'),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional().or(z.literal('')),
  seoDescription: z.string().optional().or(z.literal('')),
  published: z.coerce.boolean().optional(),
  readMinutes: z.coerce.number().optional(),
});

export const settingsSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
  profilePhoto: z.string().optional(),
  resumeUrl: z.string().optional(),
  heroHeading: z.string().optional(),
  heroSubheading: z.string().optional(),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    fiverr: z.string().optional(),
  }).partial().optional(),
  donationEnabled: z.coerce.boolean().optional(),
  seo: z.object({
    defaultTitle: z.string().optional(),
    defaultDescription: z.string().optional(),
    ogImage: z.string().optional(),
  }).partial().optional(),
  analyticsId: z.string().optional(),
});
