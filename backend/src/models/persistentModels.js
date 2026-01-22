const mongoose = require('mongoose');

// Story Schema - PERSISTENT, NO AUTO-DELETE
const storySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: String,
    hinglish: String
  },
  author: { type: String, required: true },
  description: {
    en: String,
    hi: String,
    hinglish: String
  },
  category: String,
  thumbnail: String,
  totalChapters: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'published' 
  },
  
  // SOFT DELETE - NEVER AUTO-DELETE
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: String, // Admin who deleted
  
  // TRENDING
  isTrending: { type: Boolean, default: false },
  trendingOrder: { type: Number, default: 0 },
  
  // METADATA - PERSISTENT
  uploadedAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { 
  timestamps: true
  // NO TTL INDEX - STORIES NEVER EXPIRE
});

// Chapter Schema - LINKED TO STORY, PERSISTENT
const chapterSchema = new mongoose.Schema({
  storyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Story', 
    required: true,
    index: true
  },
  chapterNumber: { type: Number, required: true },
  title: {
    en: { type: String, required: true },
    hi: String,
    hinglish: String
  },
  content: {
    en: [{ type: Object }],      // Array of ContentBlocks
    hi: [{ type: Object }],
    hinglish: [{ type: Object }]
  },
  estimatedReadTime: Number,
  
  // SOFT DELETE - ONLY WHEN STORY IS DELETED
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
}, { 
  timestamps: true
  // NO TTL INDEX - CHAPTERS NEVER EXPIRE
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

// INDEXES FOR PERFORMANCE (NO TTL)
storySchema.index({ status: 1, isDeleted: 1 });
storySchema.index({ category: 1, isDeleted: 1 });
storySchema.index({ isTrending: 1, trendingOrder: 1 });
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