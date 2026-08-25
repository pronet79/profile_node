import crypto from 'crypto';
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';

const hashIp = (ip) => crypto.createHash('sha256').update(ip || '').digest('hex').slice(0, 32);

// PUBLIC — record a pageview / custom event (best-effort, never blocks the client)
export const track = asyncHandler(async (req, res) => {
  const { path = '/', referrer = '', name = '', type = 'pageview' } = req.body || {};
  await AnalyticsEvent.create({
    type: type === 'event' ? 'event' : 'pageview',
    path: String(path).slice(0, 300),
    referrer: String(referrer).slice(0, 300),
    name: String(name).slice(0, 120),
    ipHash: hashIp(req.ip),
    userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
  });
  return sendSuccess(res, { statusCode: 201, message: 'ok' });
});

// ADMIN — aggregate summary for the dashboard
export const summary = asyncHandler(async (req, res) => {
  const days = Math.min(parseInt(req.query.days || '30', 10), 365);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totalViews, uniques, topPathsAgg, dailyAgg, topReferrersAgg] = await Promise.all([
    AnalyticsEvent.countDocuments({ type: 'pageview', createdAt: { $gte: since } }),
    AnalyticsEvent.distinct('ipHash', { createdAt: { $gte: since } }),
    AnalyticsEvent.aggregate([
      { $match: { type: 'pageview', createdAt: { $gte: since } } },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { type: 'pageview', createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { type: 'pageview', referrer: { $ne: '' }, createdAt: { $gte: since } } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
  ]);

  return sendSuccess(res, {
    data: {
      days,
      totalViews,
      uniqueVisitors: uniques.length,
      topPaths: topPathsAgg.map((p) => ({ path: p._id, count: p.count })),
      daily: dailyAgg.map((d) => ({ date: d._id, count: d.count })),
      topReferrers: topReferrersAgg.map((r) => ({ referrer: r._id, count: r.count })),
    },
  });
});
