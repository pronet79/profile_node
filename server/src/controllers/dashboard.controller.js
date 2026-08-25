import { Project } from '../models/Project.js';
import { Testimonial } from '../models/Testimonial.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { Donation } from '../models/Donation.js';
import { BlogPost } from '../models/BlogPost.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export const overview = asyncHandler(async (_req, res) => {
  const [projects, pendingFeedback, approvedTestimonials, newMessages, posts, donationAgg] = await Promise.all([
    Project.countDocuments(),
    Testimonial.countDocuments({ status: 'pending' }),
    Testimonial.countDocuments({ status: 'approved' }),
    ContactMessage.countDocuments({ status: 'new' }),
    BlogPost.countDocuments(),
    Donation.aggregate([
      { $match: { status: 'successful' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
  ]);

  // Last 6 months of support + messages for charts
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  const monthKey = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

  const [monthlySupport, monthlyMessages] = await Promise.all([
    Donation.aggregate([
      { $match: { status: 'successful', createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: monthKey, total: { $sum: '$amount' } } },
      { $sort: { _id: 1 } },
    ]),
    ContactMessage.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: monthKey, total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return sendSuccess(res, {
    data: {
      cards: {
        projects,
        pendingFeedback,
        approvedTestimonials,
        newMessages,
        posts,
        totalSupport: donationAgg[0]?.total || 0,
        supporters: donationAgg[0]?.count || 0,
      },
      charts: { monthlySupport, monthlyMessages },
    },
  });
});
