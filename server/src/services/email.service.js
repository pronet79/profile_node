import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/*
  Email delivery via the Brevo HTTP API (https://api.brevo.com), NOT SMTP.
  Many hosts (e.g. Railway) block outbound SMTP ports, which causes
  "Connection timeout" errors. The HTTP API uses port 443, which is open,
  so this is the reliable way to send from a cloud host.

  Required env vars:
    BREVO_API_KEY      - from Brevo → SMTP & API → API Keys
    MAIL_FROM_EMAIL    - a sender verified in Brevo → Senders
    MAIL_FROM_NAME     - display name for the sender (optional)
    ADMIN_NOTIFY_EMAIL - owner address that receives notifications

  Fails soft: email problems never break the API request flow.
*/

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const FROM = {
  email: process.env.MAIL_FROM_EMAIL || env.smtp.from || 'no-reply@example.com',
  name: process.env.MAIL_FROM_NAME || 'Pradosh Mukherjee',
};
const emailEnabled = Boolean(BREVO_API_KEY);

async function send({ to, subject, html }) {
  if (!emailEnabled || !to) {
    logger.warn(`[email] Email not configured (BREVO_API_KEY missing) — skipped "${subject}" to ${to}`);
    return { skipped: true };
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: FROM,
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      logger.error(`[email] Brevo failed "${subject}" to ${to}: ${res.status} ${text}`);
      return { error: `${res.status} ${text}` };
    }
    logger.info(`[email] Sent "${subject}" to ${to} via Brevo API`);
    return { ok: true };
  } catch (err) {
    logger.error(`[email] Brevo error "${subject}" to ${to}: ${err.message}`);
    return { error: err.message };
  }
}

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const owner = () => process.env.ADMIN_NOTIFY_EMAIL || env.smtp.adminNotify;

export const emailService = {
  /* ---------------------- CONTACT ---------------------- */
  async notifyNewContact(c) {
    return send({
      to: owner(),
      subject: `New project inquiry from ${c.name}`,
      html: `<h2>New contact message</h2>
             <p><b>Name:</b> ${c.name}</p>
             <p><b>Email:</b> ${c.email}</p>
             <p><b>Company:</b> ${c.company || '—'}</p>
             <p><b>Project type:</b> ${c.projectType}</p>
             <p><b>Budget:</b> ${c.budget || '—'}</p>
             <p><b>Message:</b><br/>${c.message}</p>`,
    });
  },

  /* -------------------- TESTIMONIALS (feedback) -------------------- */
  async notifyNewTestimonial(t) {
    return send({
      to: owner(),
      subject: `New testimonial from ${t.name} (${t.rating}★)`,
      html: `<h2>New testimonial awaiting review</h2>
             <p><b>Name:</b> ${t.name}</p>
             <p><b>Email:</b> ${t.email}</p>
             <p><b>Company:</b> ${t.company || '—'}</p>
             <p><b>Rating:</b> ${t.rating} / 5</p>
             <p><b>Message:</b><br/>${t.message}</p>`,
    });
  },
  async sendTestimonialAckToClient(t) {
    return send({
      to: t.email,
      subject: 'Thank you for your feedback',
      html: `<h2>Thank you, ${t.name}!</h2>
             <p>Your feedback has been received and is awaiting review before it appears publicly.</p>
             <blockquote style="border-left:3px solid #7c5cff;padding-left:12px;color:#555">${t.message}</blockquote>
             <p>I appreciate you taking the time to share it.</p>`,
    });
  },
  async sendTestimonialStatusToClient(t) {
    if (!t.email) return;
    if (t.status === 'approved') {
      return send({
        to: t.email,
        subject: 'Your testimonial is now live 🎉',
        html: `<h2>Thank you, ${t.name}!</h2>
               <p>Your testimonial has been <b>approved</b> and is now visible on the site. Thank you for your support!</p>`,
      });
    }
    if (t.status === 'rejected') {
      return send({
        to: t.email,
        subject: 'About your recent feedback',
        html: `<p>Hi ${t.name},</p>
               <p>Thank you for your feedback. After review it won't be published on the site, but it's genuinely appreciated.</p>`,
      });
    }
  },

  /* ---------------------- DONATIONS (payment) ---------------------- */
  async sendPaymentStatusToClient(d) {
    if (!d.email) return;
    if (d.status === 'successful') {
      return send({
        to: d.email,
        subject: 'Thank you for supporting my work ❤️',
        html: `<h2>Thank you, ${d.name}!</h2>
               <p>Your support of <b>${inr(d.amount)}</b> was received successfully.</p>
               <p><b>Transaction reference:</b> ${d.paymentId || d.orderId}</p>
               <p>It genuinely helps me keep building and sharing open work.</p>`,
      });
    }
    return send({
      to: d.email,
      subject: 'Your payment could not be completed',
      html: `<p>Hi ${d.name || 'there'},</p>
             <p>Unfortunately your payment of <b>${inr(d.amount)}</b> could not be verified, so it was not completed. No amount has been confirmed on our side.</p>
             <p>If you believe you were charged, please reply to this email and we'll look into it.</p>
             <p><b>Reference:</b> ${d.orderId}</p>`,
    });
  },
  async notifyPaymentToOwner(d) {
    const ok = d.status === 'successful';
    return send({
      to: owner(),
      subject: `${ok ? 'New support payment' : 'Failed payment attempt'}: ${inr(d.amount)}`,
      html: `<p><b>Status:</b> ${d.status}</p>
             <p><b>${d.name || 'Someone'}</b> (${d.email || 'no email'}) — ${inr(d.amount)}</p>
             <p><b>Message:</b> ${d.message || '—'}</p>
             <p><b>Order ID:</b> ${d.orderId}</p>
             <p><b>Payment ID:</b> ${d.paymentId || '—'}</p>`,
    });
  },
};
