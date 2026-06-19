const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ['draft', 'active', 'paused', 'completed'], default: 'draft' },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }],
  analytics: {
    sent: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 },
    bounced: { type: Number, default: 0 }
  },
  scheduledAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', CampaignSchema);