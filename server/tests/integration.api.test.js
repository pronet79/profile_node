import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import crypto from 'crypto';
import request from 'supertest';
import './setup.env.js';
import { startTestDb, stopTestDb, clearCollections } from './helpers/db.js';

/*
  Integration tests exercise real Express routes end-to-end against an
  in-memory MongoDB. If no Mongo binary is available (offline sandbox),
  the whole suite is skipped with a clear message rather than failing.
*/
let dbState = { available: false };
let app;
let Admin, Testimonial, Donation;

beforeAll(async () => {
  dbState = await startTestDb();
  if (!dbState.available) return;
  const appMod = await import('../src/app.js');
  app = appMod.createApp();
  ({ Admin } = await import('../src/models/Admin.js'));
  ({ Testimonial } = await import('../src/models/Testimonial.js'));
  ({ Donation } = await import('../src/models/Donation.js'));
});

afterAll(async () => {
  if (dbState.available) await stopTestDb();
});

beforeEach(async () => {
  if (dbState.available) await clearCollections();
});

const runOrSkip = () => (dbState.available ? it : it.skip);

async function makeAdmin() {
  const admin = new Admin({ name: 'Test Admin', email: 'admin@test.com', role: 'admin' });
  await admin.setPassword('SuperSecret1');
  await admin.save();
  return admin;
}

async function loginAgent() {
  const agent = request.agent(app);
  await makeAdmin();
  const res = await agent.post('/api/auth/login').send({ email: 'admin@test.com', password: 'SuperSecret1' });
  return { agent, token: res.body?.data?.token };
}

describe('integration: health', () => {
  runOrSkip()('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('integration: auth', () => {
  runOrSkip()('rejects wrong credentials', async () => {
    await makeAdmin();
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  runOrSkip()('logs in with correct credentials and sets a cookie', async () => {
    await makeAdmin();
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'SuperSecret1' });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
    expect(res.headers['set-cookie']?.join(';')).toMatch(/token=/);
  });

  runOrSkip()('blocks protected admin routes without a session', async () => {
    const res = await request(app).get('/api/projects/admin/all');
    expect(res.status).toBe(401);
  });

  runOrSkip()('allows protected route with a bearer token', async () => {
    const { token } = await loginAgent();
    const res = await request(app).get('/api/projects/admin/all').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('integration: testimonial moderation', () => {
  runOrSkip()('public submission is stored as pending and hidden from public list', async () => {
    const submit = await request(app).post('/api/testimonials').send({
      name: 'Happy Client', email: 'client@x.com', rating: 5, message: 'Fantastic work on our platform!',
    });
    expect(submit.status).toBe(201);

    const stored = await Testimonial.findOne({ email: 'client@x.com' });
    expect(stored.status).toBe('pending');

    const publicList = await request(app).get('/api/testimonials');
    expect(publicList.body.data.find((t) => t.email === 'client@x.com')).toBeUndefined();
  });

  runOrSkip()('honeypot submissions are rejected', async () => {
    const res = await request(app).post('/api/testimonials').send({
      name: 'Bot', email: 'bot@x.com', rating: 5, message: 'spam spam spam spam', website_hp: 'gotcha',
    });
    expect(res.status).toBe(400);
  });

  runOrSkip()('approved testimonial becomes publicly visible', async () => {
    const { token } = await loginAgent();
    await request(app).post('/api/testimonials').send({
      name: 'Real Client', email: 'real@x.com', rating: 4, message: 'Really solid delivery and comms.',
    });
    const t = await Testimonial.findOne({ email: 'real@x.com' });

    const patch = await request(app)
      .patch(`/api/testimonials/${t._id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'approved' });
    expect(patch.status).toBe(200);

    const publicList = await request(app).get('/api/testimonials');
    expect(publicList.body.data.find((x) => x.name === 'Real Client')).toBeTruthy();
  });
});

describe('integration: contact', () => {
  runOrSkip()('stores a valid contact message as new', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Lead', email: 'lead@x.com', projectType: 'SaaS', message: 'I would like to build a SaaS product.',
    });
    expect(res.status).toBe(201);
  });

  runOrSkip()('rejects an invalid project type', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Lead', email: 'lead@x.com', projectType: 'Rocket', message: 'Invalid project type test here.',
    });
    expect(res.status).toBe(400);
  });
});

describe('integration: donation verification', () => {
  runOrSkip()('marks a donation failed when the signature is forged', async () => {
    // Seed a donation in "created" state directly (order creation needs the live gateway)
    await Donation.create({ name: 'Anon', amount: 500, orderId: 'order_test_1', status: 'created' });

    const res = await request(app).post('/api/donations/verify').send({
      orderId: 'order_test_1', paymentId: 'pay_test_1', signature: 'forged_signature_value',
    });
    expect(res.status).toBe(400);

    const after = await Donation.findOne({ orderId: 'order_test_1' });
    expect(after.status).toBe('failed');
  });

  runOrSkip()('marks a donation successful with a valid signature', async () => {
    await Donation.create({ name: 'Anon', amount: 500, orderId: 'order_test_2', status: 'created' });
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update('order_test_2|pay_test_2')
      .digest('hex');

    const res = await request(app).post('/api/donations/verify').send({
      orderId: 'order_test_2', paymentId: 'pay_test_2', signature,
    });
    expect(res.status).toBe(200);

    const after = await Donation.findOne({ orderId: 'order_test_2' });
    expect(after.status).toBe('successful');
    expect(after.paymentId).toBe('pay_test_2');
  });
});

describe('integration: sitemap', () => {
  runOrSkip()('serves XML with the homepage entry', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/xml/);
    expect(res.text).toMatch(/<urlset/);
  });
});
