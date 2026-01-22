const express = require('express');
const { User, Subscription } = require('../models/authModels');
const { validatePhoneNumber, calculateExpiryDate, getPlanPrice } = require('../middleware/subscriptionMiddleware');

const router = express.Router();

// Step 1: Phone number login (no OTP)
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Create or update user
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
    } else {
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Check active subscription
    const activeSubscription = await Subscription.findOne({
      phoneNumber,
      isActive: true,
      paymentStatus: 'completed',
      expiryDate: { $gt: new Date() }
    });

    res.json({
      success: true,
      user: {
        phoneNumber: user.phoneNumber,
        hasActiveSubscription: !!activeSubscription,
        subscription: activeSubscription || null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 2: Create subscription (before payment)
router.post('/create-subscription', async (req, res) => {
  try {
    const { phoneNumber, planType } = req.body;

    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    if (!['daily', 'weekly', 'monthly'].includes(planType)) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // Check if user exists
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please login first.' });
    }

    const amount = getPlanPrice(planType);
    const expiryDate = calculateExpiryDate(planType);

    // Create pending subscription
    const subscription = new Subscription({
      phoneNumber,
      planType,
      startDate: new Date(),
      expiryDate,
      amount,
      paymentStatus: 'pending',
      isActive: false
    });

    await subscription.save();

    res.json({
      success: true,
      subscription: {
        id: subscription._id,
        planType,
        amount,
        expiryDate
      },
      paymentUrl: `/payment/${subscription._id}` // Redirect to payment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 3: Payment success callback
router.post('/payment-success', async (req, res) => {
  try {
    const { subscriptionId, paymentId } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Deactivate any existing active subscriptions for this phone number
    await Subscription.updateMany(
      { 
        phoneNumber: subscription.phoneNumber,
        isActive: true 
      },
      { isActive: false }
    );

    // Activate new subscription
    subscription.paymentStatus = 'completed';
    subscription.paymentId = paymentId;
    subscription.isActive = true;
    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      subscription: {
        planType: subscription.planType,
        expiryDate: subscription.expiryDate,
        isActive: true
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 4: Payment failure callback
router.post('/payment-failure', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    await Subscription.findByIdAndUpdate(subscriptionId, {
      paymentStatus: 'failed'
    });

    res.json({
      success: false,
      message: 'Payment failed. Please try again.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user subscription status
router.get('/status/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const activeSubscription = await Subscription.findOne({
      phoneNumber,
      isActive: true,
      paymentStatus: 'completed',
      expiryDate: { $gt: new Date() }
    });

    res.json({
      hasActiveSubscription: !!activeSubscription,
      subscription: activeSubscription || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SIMPLE USER SUBSCRIPTION (NO AUTH REQUIRED)
router.post('/simple-subscribe', async (req, res) => {
  try {
    const { phoneNumber, planType } = req.body;
    
    console.log('Simple subscription request:', { phoneNumber, planType });
    
    // Calculate expiry based on plan
    const now = new Date();
    let expiryDate;
    
    switch(planType) {
      case 'daily':
        expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
    
    // Create or update user
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
    }
    user.lastLoginAt = new Date();
    await user.save();
    
    // Deactivate existing subscriptions
    await Subscription.updateMany(
      { phoneNumber, isActive: true },
      { isActive: false }
    );
    
    // Create new active subscription
    const subscription = new Subscription({
      phoneNumber,
      planType,
      startDate: now,
      expiryDate,
      amount: planType === 'daily' ? 10 : planType === 'weekly' ? 20 : 30,
      paymentStatus: 'completed',
      isActive: true
    });
    
    await subscription.save();
    
    console.log('Subscription created:', subscription._id);
    
    res.json({
      success: true,
      subscription: {
        planType,
        expiryDate,
        isActive: true
      }
    });
    
  } catch (error) {
    console.error('Simple subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;