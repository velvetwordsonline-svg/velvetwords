const mongoose = require('mongoose');

// Story Schema - OPTIMIZED FOR PERFORMANCE
const storySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true, index: true }
  },
  author: { type: String, required: true, index: true },
  description: {
    en: String
  },
  category: { type: String, index: true },
  thumbnail: String,
  totalChapters: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['processing', 'published', 'failed'], 
    default: 'processing',
    index: true
  },
  
  // SOFT DELETE
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  deletedBy: String,
  
  // TRENDING
  isTrending: { type: Boolean, default: false, index: true },
  trendingOrder: { type: Number, default: 0 },
  
  // METADATA
  uploadedAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 }
}, { 
  timestamps: true,
  read: 'secondaryPreferred'
});

// Chapter Schema - OPTIMIZED
const chapterSchema = new mongoose.Schema({
  storyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Story', 
    required: true,
    index: true
  },
  chapterNumber: { type: Number, required: true },
  title: {
    en: { type: String, required: true }
  },
  content: {
    en: [{ type: Object }] // Compressed content blocks
  },
  estimatedReadTime: { type: Number, default: 5 },
  
  // SOFT DELETE
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
}, { 
  timestamps: true
});

// Admin Schema - FOR AUDIT TRAIL
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  role: { type: String, default: 'admin' },
  lastLogin: Date,
  actions: [{
    action: String, // 'upload', 'delete', 'modify'
    storyId: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// User Schema
const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  subscriptionType: { type: String, enum: ['daily', 'weekly', 'monthly'], default: null },
  subscriptionExpiry: { type: Date, default: null },
  readingHistory: [{
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    readAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// OPTIMIZED INDEXES
storySchema.index({ status: 1, isDeleted: 1, createdAt: -1 });
storySchema.index({ category: 1, status: 1, isDeleted: 1 });
storySchema.index({ isTrending: 1, status: 1, isDeleted: 1 });
chapterSchema.index({ storyId: 1, chapterNumber: 1 });

// EXPORT WITH SAFE MODEL CREATION
let Story, Chapter, Admin, User;

try {
  Story = mongoose.model('Story');
} catch (error) {
  Story = mongoose.model('Story', storySchema);
}

try {
  Chapter = mongoose.model('Chapter');
} catch (error) {
  Chapter = mongoose.model('Chapter', chapterSchema);
}

try {
  Admin = mongoose.model('Admin');
} catch (error) {
  Admin = mongoose.model('Admin', adminSchema);
}

try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', userSchema);
}

module.exports = { Story, Chapter, Admin, User };