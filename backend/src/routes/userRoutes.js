const express = require('express');
const { User } = require('../models/authModels');
const router = express.Router();

// Phone number login/register
router.post('/auth/phone', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length !== 10) {
      return res.status(400).json({ error: 'Valid 10-digit phone number required' });
    }

    // Check if user exists
    let user = await User.findOne({ phoneNumber: phone });
    
    if (!user) {
      // Create new user
      user = new User({
        phoneNumber: phone,
        isVerified: true,
        subscription: {
          plan: 'none',
          isActive: false
        }
      });
      
      // Special access for specific phone number
      if (phone === '8923529921') {
        user.subscription = {
          plan: 'premium',
          isActive: true,
          expiresAt: null // Never expires
        };
      }
      
      await user.save();
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phoneNumber,
        isVerified: user.isVerified,
        subscription: user.subscription,
        readingHistory: user.readingHistory
      }
    });
  } catch (error) {
    console.error('Phone auth error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Subscribe to plan
router.post('/subscription/subscribe', async (req, res) => {
  try {
    const { phone, plan } = req.body;
    
    if (!phone || !plan) {
      return res.status(400).json({ error: 'Phone and plan required' });
    }

    const user = await User.findOne({ phoneNumber: phone });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate expiry date
    const daysToAdd = plan === 'daily' ? 1 : plan === 'weekly' ? 7 : plan === 'monthly' ? 30 : 0;
    const expiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);

    user.subscription = {
      plan,
      expiresAt,
      isActive: true
    };

    await user.save();

    res.json({
      success: true,
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update reading progress
router.post('/reading/progress', async (req, res) => {
  try {
    const { phone, storyId, chapterNumber, position, percentage } = req.body;
    
    const user = await User.findOne({ phoneNumber: phone });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find existing progress or create new
    const existingIndex = user.readingHistory.findIndex(h => h.storyId.toString() === storyId);
    
    const progressData = {
      storyId,
      lastChapterRead: chapterNumber,
      lastReadPosition: position,
      progressPercentage: percentage,
      lastReadAt: new Date()
    };

    if (existingIndex >= 0) {
      user.readingHistory[existingIndex] = progressData;
    } else {
      user.readingHistory.push(progressData);
    }

    await user.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user data
router.get('/user/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    
    const user = await User.findOne({ phoneNumber: phone }).populate('readingHistory.storyId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      phone: user.phoneNumber,
      isVerified: user.isVerified,
      subscription: user.subscription,
      readingHistory: user.readingHistory
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check chapter access
router.post('/access/chapter', async (req, res) => {
  try {
    const { phone, chapterNumber } = req.body;
    
    // Chapter 1 is always free
    if (chapterNumber === 1) {
      return res.json({ hasAccess: true, reason: 'free_chapter' });
    }

    // Special access for specific phone
    if (phone === '8923529921') {
      return res.json({ hasAccess: true, reason: 'premium_access' });
    }

    const user = await User.findOne({ phoneNumber: phone });
    if (!user) {
      return res.json({ hasAccess: false, reason: 'user_not_found' });
    }

    if (!user.subscription.isActive) {
      return res.json({ hasAccess: false, reason: 'no_subscription' });
    }

    if (user.subscription.expiresAt && new Date() > user.subscription.expiresAt) {
      return res.json({ hasAccess: false, reason: 'subscription_expired' });
    }

    res.json({ hasAccess: true, reason: 'valid_subscription' });
  } catch (error) {
    console.error('Access check error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;