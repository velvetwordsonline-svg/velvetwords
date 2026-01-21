const mongoose = require('mongoose');

// User Model
const userSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[6-9]\d{9}$/ // Indian phone number format
  },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
});

// Subscription Model
const subscriptionSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    required: true,
    ref: 'User'
  },
  planType: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly'], 
    required: true 
  },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  paymentId: String,
  amount: { type: Number, required: true },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

// Index for efficient queries
subscriptionSchema.index({ phoneNumber: 1, isActive: 1 });
subscriptionSchema.index({ expiryDate: 1 });

module.exports = {
  User: mongoose.models.User || mongoose.model('User', userSchema),
  Subscription: mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema)
};