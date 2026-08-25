import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let transporter = null;
if (env.smtp.enabled) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.password },
  });
}

/* Fails soft: email problems should never break the API request flow. */
async function send({ to, subject, html }) {
  if (!transporter) {
    logger.warn(`[email] SMTP disabled — skipped "${subject}" to ${to}`);
    return { skipped: true };
  }
  try {
    const info = await transporter.sendMail({ from: env.smtp.from, to, subject, html });
    logger.info(`[email] Sent "${subject}" to ${to} (${info.messageId})`);
    return info;
  } catch (err) {
    logger.error(`[email] Failed "${subject}" to ${to}: ${err.message}`);
    return { error: err.message };
  }
}

export const emailService = {
  async notifyNewTestimonial(t) {
    if (!env.smtp.adminNotify) return;
    return send({
      to: env.smtp.adminNotify,
      subject: `New testimonial from ${t.name} (${t.rating}★)`,
      html: `<h2>New testimonial awaiting review</h2>
             <p><b>Name:</b> ${t.name}</p>
             <p><b>Email:</b> ${t.email}</p>
             <p><b>Company:</b> ${t.company || '—'}</p>
             <p><b>Rating:</b> ${t.rating} / 5</p>
             <p><b>Message:</b><br/>${t.message}</p>`,
    });
  },

  async notifyNewContact(c) {
    if (!env.smtp.adminNotify) return;
    return send({
      to: env.smtp.adminNotify,
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

  async sendDonationReceipt(d) {
    if (!d.email) return;
    return send({
      to: d.email,
      subject: 'Thank you for supporting my work ❤️',
      html: `<h2>Thank you, ${d.name}!</h2>
             <p>Your support of <b>₹${d.amount}</b> was received successfully.</p>
             <p>Transaction reference: ${d.paymentId}</p>
             <p>It genuinely helps me keep building and sharing open work.</p>`,
    });
  },

  async notifyDonation(d) {
    if (!env.smtp.adminNotify) return;
    return send({
      to: env.smtp.adminNotify,
      subject: `New support payment: ₹${d.amount}`,
      html: `<p><b>${d.name}</b> (${d.email || 'no email'}) supported with ₹${d.amount}.</p>
             <p>Message: ${d.message || '—'}</p>
             <p>Payment ID: ${d.paymentId}</p>`,
    });
  },
};
