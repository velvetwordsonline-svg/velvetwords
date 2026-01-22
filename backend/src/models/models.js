const mongoose = require('mongoose');

// Story Model
const storySchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: String,
    hinglish: String
  },
  author: { type: String, required: true },
  thumbnail: String,
  description: {
    en: String,
    hi: String,
    hinglish: String
  },
  category: String,
  totalChapters: { type: Number, default: 0 },
  isTrending: { type: Boolean, default: false },
  trendingOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Chapter Model
const chapterSchema = new mongoose.Schema({
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
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
  estimatedReadTime: Number
}, { timestamps: true });

chapterSchema.index({ storyId: 1, chapterNumber: 1 });

// Admin Model
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String
}, { timestamps: true });

// User Model
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

module.exports = {
  Story: mongoose.models.Story || mongoose.model('Story', storySchema),
  Chapter: mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema),
  Admin: mongoose.models.Admin || mongoose.model('Admin', adminSchema),
  User: mongoose.models.User || mongoose.model('User', userSchema)
};
