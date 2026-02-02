const { User, Subscription } = require('../models/authModels');

// Middleware to check subscription access
const checkSubscriptionAccess = async (req, res, next) => {
  try {
    const { chapterNumber } = req.query;
    const phoneNumber = req.headers['x-phone-number'];

    // Allow Chapter 1 for everyone
    if (!chapterNumber || parseInt(chapterNumber) === 1) {
      return next();
    }

    // For chapters > 1, check subscription
    if (!phoneNumber) {
      return res.status(401).json({ 
        error: 'subscription_required',
        message: 'Login and subscribe to unlock more chapters'
      });
    }

    // Check active subscription
    const activeSubscription = await Subscription.findOne({
      phoneNumber,
      isActive: true,
      paymentStatus: 'completed',
      expiryDate: { $gt: new Date() }
    });

    if (!activeSubscription) {
      return res.status(402).json({ 
        error: 'subscription_expired',
        message: 'Your subscription has expired. Please renew to continue reading.'
      });
    }

    // Add subscription info to request
    req.subscription = activeSubscription;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to validate phone number
const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
};

// Helper function to calculate expiry date
const calculateExpiryDate = (planType) => {
  const now = new Date();
  switch (planType) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    default:
      throw new Error('Invalid plan type');
  }
};

// Helper function to get plan price
const getPlanPrice = (planType) => {
  const prices = {
    daily: 10,
    weekly: 20,
    monthly: 30
  };
  return prices[planType];
};

module.exports = {
  checkSubscriptionAccess,
  validatePhoneNumber,
  calculateExpiryDate,
  getPlanPrice
};