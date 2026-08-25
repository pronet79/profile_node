/* Seeds an initial admin, site settings, skills, services and a couple of demo
   projects/experience so the site is populated on first run.
   Run: npm run seed */
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB } from '../config/db.js';
import { logger } from './logger.js';
import { Admin } from '../models/Admin.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Skill } from '../models/Skill.js';
import { Service } from '../models/Service.js';
import { Project } from '../models/Project.js';
import { Experience } from '../models/Experience.js';
import { BlogPost } from '../models/BlogPost.js';
import { Testimonial } from '../models/Testimonial.js';

const SKILLS = {
  Backend: ['PHP', 'Laravel 8–12', 'CodeIgniter', 'Node.js', 'Express.js'],
  Frontend: ['React.js', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
  Database: ['MongoDB', 'MySQL', 'Redis'],
  'APIs & Integrations': ['REST API', 'WebSockets', 'Payment APIs', 'Shopify APIs', 'Third-party APIs'],
  'DevOps / Cloud': ['Git', 'Linux', 'Railway', 'AWS', 'Deployment', 'Server Management'],
  AI: ['AI API Integration', 'AI Automation', 'AI-powered SaaS', 'LLM-based Applications'],
};

const SERVICES = [
  { title: 'SaaS Development', description: 'Scalable subscription-based web applications.', icon: 'layout-grid', tags: ['Laravel', 'Node.js', 'React', 'Stripe'] },
  { title: 'ERP & CRM', description: 'Custom enterprise and business management systems.', icon: 'building-2', tags: ['Laravel', 'MySQL', 'REST'] },
  { title: 'Shopify Applications', description: 'Shopify apps, integrations and merchant tools.', icon: 'shopping-bag', tags: ['Shopify', 'Node.js', 'Polaris'] },
  { title: 'AI-Powered Applications', description: 'AI integrations, automation and intelligent workflows.', icon: 'sparkles', tags: ['LLM', 'OpenAI', 'Automation'] },
  { title: 'Real-Time Systems', description: 'Live dashboards, notifications, tracking and WebSocket applications.', icon: 'radio', tags: ['WebSockets', 'Redis', 'Socket.IO'] },
  { title: 'API & Third-Party Integrations', description: 'REST APIs, payment gateways and external service integrations.', icon: 'plug', tags: ['REST', 'Razorpay', 'Webhooks'] },
];

const PROJECTS = [
  {
    title: 'FileDrop', category: 'Shopify SaaS', featured: true, order: 0,
    shortDescription: 'A Shopify file-upload SaaS letting merchants collect custom files at checkout.',
    overview: 'FileDrop is a subscription Shopify app that lets merchants accept file uploads from customers on product and cart pages.',
    problem: 'Merchants selling customizable products had no reliable way to collect artwork, documents or images tied to an order.',
    solution: 'A embedded Shopify app with secure cloud storage, per-plan upload limits, and an order-linked file dashboard.',
    keyFeatures: ['Drag-and-drop uploads', 'Per-plan quotas & billing', 'Order-linked files', 'Cloud storage', 'Merchant dashboard'],
    technologies: ['Node.js', 'Express', 'React', 'MongoDB', 'Shopify API', 'Cloud Storage'],
    role: 'Sole architect and full-stack developer.',
    architecture: 'Embedded Shopify app → Node API → MongoDB, with S3-compatible object storage and webhook-driven billing.',
    deployment: 'Railway + managed MongoDB + object storage/CDN.',
    results: 'Reduced order-clarification emails and enabled a new customizable-product line for merchants.',
    githubUrl: '', liveUrl: '',
  },
  {
    title: 'EV Charging Management System', category: 'Real-Time SaaS', order: 1,
    shortDescription: 'Live monitoring and billing platform for EV charging networks.',
    technologies: ['Laravel', 'MySQL', 'WebSockets', 'React'], featured: false,
  },
  {
    title: 'Insurance ERP', category: 'ERP', order: 2,
    shortDescription: 'End-to-end policy, claims and agent-management ERP.',
    technologies: ['Laravel', 'MySQL', 'REST API'], featured: false,
  },
];

const EXPERIENCE = [
  {
    company: 'Freelance / Independent', position: 'Senior Full-Stack Developer', type: 'freelance',
    startDate: new Date('2019-01-01'), current: true, order: 0,
    achievements: ['Delivered 50+ production projects across SaaS, ERP and Shopify', 'Built payment and AI integrations end-to-end'],
    technologies: ['Laravel', 'Node.js', 'React', 'MongoDB', 'Shopify'],
  },
];

const BLOG_POSTS = [
  {
    title: 'Verifying Razorpay Payments the Right Way',
    excerpt: 'Why the frontend callback is never enough, and how server-side HMAC verification keeps payments trustworthy.',
    category: 'APIs',
    tags: ['Razorpay', 'Payments', 'Security', 'Node.js'],
    readMinutes: 5,
    published: true,
    content: `When you accept payments, the single most important rule is: **never trust the client**.

A browser can be manipulated. A "payment success" callback from the frontend tells you what the *page* claims happened — not what actually settled with the gateway.

## The correct flow

1. The client asks your server to **create an order**. Your server calls the gateway and stores the order id with a \`created\` status.
2. The gateway's checkout widget collects payment and returns an \`order_id\`, \`payment_id\`, and \`signature\`.
3. The client sends those three values to **your server**, which recomputes the signature:

\`\`\`js
const expected = crypto
  .createHmac('sha256', KEY_SECRET)
  .update(\`\${orderId}|\${paymentId}\`)
  .digest('hex');
\`\`\`

4. Only if \`expected\` matches the received signature (via a **timing-safe compare**) do you mark the donation \`successful\`.

## Why the HMAC works

The signature is keyed with a secret **only your server and the gateway know**. A forged \`payment_id\` can't produce a matching signature without that secret, so tampering is detected immediately.

Treat the verify endpoint as the single source of truth, store only gateway ids (never card data), and you have a payment flow you can actually rely on.`,
  },
  {
    title: 'A Pragmatic MERN Project Structure',
    excerpt: 'How I organise a full-stack app so it stays readable as it grows: layered backend, config-driven admin, consistent API envelopes.',
    category: 'Node.js',
    tags: ['MERN', 'Architecture', 'Express', 'React'],
    readMinutes: 6,
    published: true,
    content: `Most MERN projects rot not because of the framework, but because of **inconsistent structure**. Here's the layout I keep coming back to.

## Backend: thin routes, fat services

- **routes/** — wiring only: path, middleware, controller.
- **controllers/** — request/response shaping.
- **services/** — real logic (payments, email) behind small interfaces.
- **models/** — Mongoose schemas with indexes and hooks.
- **middleware/** — auth, validation, rate limits, error handling.

Every response uses one envelope:

\`\`\`json
{ "success": true, "message": "…", "data": {} }
\`\`\`

so the frontend never guesses where the payload is.

## Frontend: a config-driven admin

Instead of ten near-identical CRUD screens, one \`ResourceManager\` renders a table and a form from a \`fields\` config. New resource? A few lines of config, not a new page.

## The payoff

Consistency compounds. When errors, auth, and data access all work the same way everywhere, onboarding is faster and bugs have fewer places to hide.`,
  },
];

const TESTIMONIALS = [
  {
    name: 'A. Sharma', company: 'D2C Founder', rating: 5, status: 'approved',
    email: 'sharma@example.com',
    message: 'Delivered our Shopify file-upload app ahead of schedule and handled the billing edge cases we hadn\'t even thought of. Communication was excellent throughout.',
  },
  {
    name: 'R. Iyer', company: 'Logistics SaaS', rating: 5, status: 'approved',
    email: 'iyer@example.com',
    message: 'The real-time dashboard just works. Clean architecture, sensible trade-offs, and thorough documentation made handoff painless.',
  },
];

async function run() {
  await connectDB(env.mongoUri);

  // Admin
  let admin = await Admin.findOne({ email: env.seed.email });
  if (!admin) {
    admin = new Admin({ name: env.seed.name, email: env.seed.email, role: 'superadmin' });
    await admin.setPassword(env.seed.password);
    await admin.save();
    logger.info(`Seeded admin: ${env.seed.email}`);
  } else {
    logger.info('Admin already exists — skipping.');
  }

  // Settings
  const settings = await SiteSettings.getSingleton();
  settings.email = settings.email || env.seed.email;
  await settings.save();

  // Skills
  if ((await Skill.countDocuments()) === 0) {
    const docs = [];
    for (const [category, names] of Object.entries(SKILLS)) {
      names.forEach((name, i) => docs.push({ category, name, order: i }));
    }
    await Skill.insertMany(docs);
    logger.info(`Seeded ${docs.length} skills.`);
  }

  // Services
  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany(SERVICES.map((s, i) => ({ ...s, order: i })));
    logger.info(`Seeded ${SERVICES.length} services.`);
  }

  // Projects
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany(PROJECTS);
    logger.info(`Seeded ${PROJECTS.length} projects.`);
  }

  // Experience
  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany(EXPERIENCE);
    logger.info(`Seeded ${EXPERIENCE.length} experience entries.`);
  }

  // Blog posts (use create() so slug/publishedAt pre-validate hooks run)
  if ((await BlogPost.countDocuments()) === 0) {
    for (const post of BLOG_POSTS) await BlogPost.create(post);
    logger.info(`Seeded ${BLOG_POSTS.length} blog posts.`);
  }

  // Testimonials (pre-approved so the wall isn't empty on first run)
  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(TESTIMONIALS);
    logger.info(`Seeded ${TESTIMONIALS.length} testimonials.`);
  }

  await mongoose.disconnect();
  logger.info('Seed complete.');
  process.exit(0);
}

run().catch((err) => {
  logger.error(`Seed failed: ${err.message}`);
  process.exit(1);
});
