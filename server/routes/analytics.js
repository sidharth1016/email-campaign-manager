const express = require('express');
const Campaign = require('../models/Campaign');
const Lead = require('../models/Lead');
const Template = require('../models/Template');
const auth = require('../middleware/auth');
const router = express.Router();

// Dashboard summary analytics
router.get('/summary', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id });
    const leads = await Lead.find({ user: req.user.id });
    const templates = await Template.find({ user: req.user.id });

    const totalSent = campaigns.reduce((acc, c) => acc + c.analytics.sent, 0);
    const totalOpened = campaigns.reduce((acc, c) => acc + c.analytics.opened, 0);
    const totalClicked = campaigns.reduce((acc, c) => acc + c.analytics.clicked, 0);
    const totalBounced = campaigns.reduce((acc, c) => acc + c.analytics.bounced, 0);

    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;

    res.json({
      totalCampaigns: campaigns.length,
      activeCampaigns,
      draftCampaigns,
      totalLeads: leads.length,
      activeLeads: leads.filter(l => l.status === 'active').length,
      totalTemplates: templates.length,
      emailStats: {
        sent: totalSent,
        opened: totalOpened,
        clicked: totalClicked,
        bounced: totalBounced,
        openRate: totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0,
        clickRate: totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : 0,
        bounceRate: totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(1) : 0
      },
      recentCampaigns: campaigns.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;