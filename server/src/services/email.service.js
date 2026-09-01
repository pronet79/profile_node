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
    connectionTimeout: 10000,   // 10s
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/* Fails soft: email problems should never break the API request flow. */
async function send({ to, subject, html }) {
  if (!transporter) {
    logger.warn(`[email] SMTP disabled — skipped "${subject}" to ${to}`);
    return { skipped: true };
  }
  if (!to) return { skipped: true };
  try {
    const info = await transporter.sendMail({ from: env.smtp.from, to, subject, html });
    logger.info(`[email] Sent "${subject}" to ${to} (${info.messageId})`);
    return info;
  } catch (err) {
    logger.error(`[email] Failed "${subject}" to ${to}: ${err.message}`);
    return { error: err.message };
  }
}

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const owner = () => env.smtp.adminNotify;

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
  // Owner: a new testimonial is awaiting review.
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
  // Client: acknowledgement that their feedback was received.
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
  // Client: their testimonial was approved or rejected.
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
  // Client: payment status (successful or failed).
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
  // Owner: a payment succeeded or failed.
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
