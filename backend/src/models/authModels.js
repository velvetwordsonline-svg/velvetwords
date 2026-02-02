const mongoose = require('mongoose');

// User Model
const userSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[6-9]\d{9}$/ // Indian phone number format
  },
  isVerified: { type: Boolean, default: true },
  subscription: {
    plan: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
    expiresAt: Date,
    isActive: { type: Boolean, default: false }
  },
  readingHistory: [{
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    lastChapterRead: Number,
    lastReadPosition: Number,
    progressPercentage: Number,
    lastReadAt: { type: Date, default: Date.now }
  }],
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

// Export models with proper checking
let User, Subscription;

try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', userSchema);
}

try {
  Subscription = mongoose.model('Subscription');
} catch (error) {
  Subscription = mongoose.model('Subscription', subscriptionSchema);
}

module.exports = { User, Subscription };