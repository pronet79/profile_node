import mongoose from 'mongoose';

/*
  Lightweight, privacy-conscious analytics.
  We store the path and a coarse event type only — no cookies, no personal
  identifiers. The visitor IP is hashed (not stored raw) purely to allow a
  rough unique-visitor estimate.
*/
const analyticsSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['pageview', 'event'], default: 'pageview', index: true },
    path: { type: String, required: true, trim: true, index: true },
    referrer: { type: String, trim: true, default: '' },
    name: { type: String, trim: true, default: '' }, // for custom events
    ipHash: { type: String, index: true },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

// Auto-expire raw events after 180 days to keep the collection small.
analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsSchema);
