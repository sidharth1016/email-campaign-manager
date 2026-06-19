const express = require('express');
const Campaign = require('../models/Campaign');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all campaigns
router.get('/', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id }).populate('template').sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single campaign
router.get('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, user: req.user.id }).populate('template').populate('leads');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create campaign
router.post('/', auth, async (req, res) => {
  try {
    const campaign = new Campaign({ ...req.body, user: req.user.id });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update campaign
router.put('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete campaign
router.delete('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Launch campaign (simulate sending)
router.post('/:id/launch', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, user: req.user.id }).populate('leads');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    const totalLeads = campaign.leads.length || Math.floor(Math.random() * 200 + 50);
    campaign.status = 'active';
    campaign.analytics.sent = totalLeads;
    campaign.analytics.opened = Math.floor(totalLeads * (Math.random() * 0.3 + 0.2));
    campaign.analytics.clicked = Math.floor(campaign.analytics.opened * (Math.random() * 0.3 + 0.1));
    campaign.analytics.bounced = Math.floor(totalLeads * 0.02);
    await campaign.save();

    res.json({ message: 'Campaign launched successfully', campaign });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;