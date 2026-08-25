import { Donation } from '../models/Donation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { paymentService } from '../services/payment.service.js';
import { emailService } from '../services/email.service.js';

// PUBLIC — create a payment order
export const createOrder = asyncHandler(async (req, res) => {
  if (!paymentService.isEnabled()) throw ApiError.badRequest('Payments are currently unavailable.');
  const { name, email, message, amount, showPublicly } = req.body;

  const receipt = `don_${Date.now()}`;
  const order = await paymentService.createOrder({ amount, currency: 'INR', receipt });

  await Donation.create({
    name: name || (showPublicly ? name : 'Anonymous Supporter'),
    email,
    message,
    amount,
    showPublicly,
    orderId: order.id,
    status: 'created',
  });

  return sendSuccess(res, {
    message: 'Order created',
    data: { orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID },
  });
});

// PUBLIC — verify signature on the backend (source of truth)
export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const donation = await Donation.findOne({ orderId });
  if (!donation) throw ApiError.notFound('Order not found');

  const valid = paymentService.verifySignature({ orderId, paymentId, signature });
  if (!valid) {
    donation.status = 'failed';
    await donation.save();
    throw ApiError.badRequest('Payment verification failed');
  }

  donation.paymentId = paymentId;
  donation.signature = signature;
  donation.status = 'successful';
  await donation.save();

  // fire-and-forget notifications
  emailService.sendDonationReceipt(donation);
  emailService.notifyDonation(donation);

  return sendSuccess(res, {
    message: 'Thank you for supporting my work ❤️',
    data: { id: donation._id, amount: donation.amount },
  });
});

// PUBLIC — approved public supporters wall
export const listPublicSupporters = asyncHandler(async (_req, res) => {
  const items = await Donation.find({ status: 'successful', showPublicly: true })
    .select('name amount message createdAt')
    .sort({ createdAt: -1 })
    .limit(50);
  return sendSuccess(res, { data: items });
});

// ADMIN
export const listAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
  }
  const items = await Donation.find(filter).sort({ createdAt: -1 });
  return sendSuccess(res, { data: items });
});

export const stats = asyncHandler(async (_req, res) => {
  const [agg] = await Donation.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: { $cond: [{ $eq: ['$status', 'successful'] }, '$amount', 0] } },
        successful: { $sum: { $cond: [{ $eq: ['$status', 'successful'] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $in: ['$status', ['created', 'pending']] }, 1, 0] } },
      },
    },
  ]);
  const supporters = await Donation.distinct('email', { status: 'successful' });
  return sendSuccess(res, {
    data: {
      totalSupport: agg?.total || 0,
      supporters: supporters.filter(Boolean).length,
      successful: agg?.successful || 0,
      failed: agg?.failed || 0,
      pending: agg?.pending || 0,
    },
  });
});
