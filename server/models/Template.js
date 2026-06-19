const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, enum: ['promotional', 'newsletter', 'transactional', 'welcome'], default: 'promotional' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', TemplateSchema);