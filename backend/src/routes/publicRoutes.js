const mongoose = require('mongoose');
const express = require('express');
const { Story, Chapter } = require('../models/persistentModels');
const { checkSubscriptionAccess } = require('../middleware/subscriptionMiddleware');

const router = express.Router();

// Get all published stories
router.get('/stories', async (req, res) => {
  try {
    const { lang = 'en', category } = req.query;
    const query = { 
      status: 'published',
      isDeleted: { $ne: true }
    };
    
    // Handle category filtering - match both ID format and name format
    if (category) {
      const categoryMap = {
        'everyday-chemistry': 'Everyday Chemistry',
        'slow-emotional': 'Slow & Emotional', 
        'city-travel': 'City Travel & Temporary Love',
        'forbidden-risky': 'Forbidden & Risky Desire',
        'midnight-confession': 'Midnight & Confession',
        'power-elite': 'Power Identity & Elite Lives'
      };
      
      // Check if category is an ID or name
      const categoryName = categoryMap[category] || category;
      query.category = categoryName;
    }

    const stories = await Story.find(query).sort({ createdAt: -1 });
    
    // Category mapping
    const categoryMap = {
      'everyday-chemistry': 'Everyday Chemistry',
      'slow-emotional': 'Slow & Emotional',
      'city-travel': 'City Travel & Temporary Love',
      'forbidden-risky': 'Forbidden & Risky Desire',
      'midnight-confession': 'Midnight & Confession',
      'power-elite': 'Power Identity & Elite Lives'
    };
    
    // Format response based on language
    const formatted = stories.map(story => ({
      id: story._id,
      title: story.title[lang] || story.title.en,
      author: story.author,
      description: story.description[lang] || story.description.en,
      thumbnail: story.thumbnail,
      category: categoryMap[story.category] || story.category,
      totalChapters: story.totalChapters,
      rating: story.rating,
      reviewCount: story.reviewCount,
      createdAt: story.createdAt
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single story by ID with first chapter
router.get('/stories/:id', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const storyId = req.params.id;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ error: 'Invalid story ID' });
    }
    
    const story = await Story.findById(new mongoose.Types.ObjectId(storyId));
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Get first chapter automatically
    const firstChapter = await Chapter.findOne({ storyId: new mongoose.Types.ObjectId(storyId) })
      .sort({ chapterNumber: 1 });

    const response = {
      id: story._id,
      title: story.title[lang] || story.title.en,
      author: story.author,
      description: story.description[lang] || story.description.en,
      thumbnail: story.thumbnail,
      category: story.category,
      totalChapters: story.totalChapters,
      rating: story.rating,
      reviewCount: story.reviewCount,
      createdAt: story.createdAt
    };

    // Include first chapter if exists
    if (firstChapter) {
      const content = firstChapter.content && firstChapter.content[lang] ? 
        firstChapter.content[lang] : 
        (firstChapter.content && firstChapter.content.en ? firstChapter.content.en : []);

      response.firstChapter = {
        id: firstChapter._id,
        chapterNumber: firstChapter.chapterNumber,
        title: (firstChapter.title && firstChapter.title[lang]) ? firstChapter.title[lang] : 
               (firstChapter.title && firstChapter.title.en ? firstChapter.title.en : `Chapter ${firstChapter.chapterNumber}`),
        content: content,
        estimatedReadTime: firstChapter.estimatedReadTime || 5
      };
    }

    res.json(response);
  } catch (error) {
    console.error('Story fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get chapters for a story
router.get('/stories/:id/chapters', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const storyId = req.params.id;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ error: 'Invalid story ID' });
    }

    const chapters = await Chapter.find({ storyId: new mongoose.Types.ObjectId(storyId) })
      .sort({ chapterNumber: 1 });

    const formatted = chapters.map(chapter => ({
      id: chapter._id,
      chapterNumber: chapter.chapterNumber,
      title: (chapter.title && chapter.title[lang]) ? chapter.title[lang] : 
             (chapter.title && chapter.title.en ? chapter.title.en : `Chapter ${chapter.chapterNumber}`),
      estimatedReadTime: chapter.estimatedReadTime || 5
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Chapters fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific chapter by storyId and chapterId
router.get('/stories/:storyId/chapters/:chapterId', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const { storyId, chapterId } = req.params;
    
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(storyId) || !mongoose.Types.ObjectId.isValid(chapterId)) {
      return res.status(400).json({ error: 'Invalid story or chapter ID' });
    }

    // Find chapter that belongs to the story
    const chapter = await Chapter.findOne({ 
      _id: new mongoose.Types.ObjectId(chapterId),
      storyId: new mongoose.Types.ObjectId(storyId)
    });

    if (!chapter) {
      // Try to get first chapter if specific chapter not found
      const firstChapter = await Chapter.findOne({ 
        storyId: new mongoose.Types.ObjectId(storyId) 
      }).sort({ chapterNumber: 1 });
      
      if (!firstChapter) {
        return res.status(404).json({ error: 'No chapters found for this story' });
      }
      
      // Return first chapter instead
      const content = firstChapter.content && firstChapter.content[lang] ? 
        firstChapter.content[lang] : 
        (firstChapter.content && firstChapter.content.en ? firstChapter.content.en : []);

      return res.json({
        id: firstChapter._id,
        storyId: firstChapter.storyId,
        chapterNumber: firstChapter.chapterNumber,
        title: (firstChapter.title && firstChapter.title[lang]) ? firstChapter.title[lang] : 
               (firstChapter.title && firstChapter.title.en ? firstChapter.title.en : `Chapter ${firstChapter.chapterNumber}`),
        content: content,
        estimatedReadTime: firstChapter.estimatedReadTime || 5,
        isFirstChapter: true
      });
    }

    // Return requested chapter
    const content = chapter.content && chapter.content[lang] ? 
      chapter.content[lang] : 
      (chapter.content && chapter.content.en ? chapter.content.en : []);

    res.json({
      id: chapter._id,
      storyId: chapter.storyId,
      chapterNumber: chapter.chapterNumber,
      title: (chapter.title && chapter.title[lang]) ? chapter.title[lang] : 
             (chapter.title && chapter.title.en ? chapter.title.en : `Chapter ${chapter.chapterNumber}`),
      content: content,
      estimatedReadTime: chapter.estimatedReadTime || 5
    });
  } catch (error) {
    console.error('Chapter fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single chapter content (with subscription check)
router.get('/chapters/:id', checkSubscriptionAccess, async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const chapterId = req.params.id;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(chapterId)) {
      return res.status(400).json({ error: 'Invalid chapter ID' });
    }

    const chapter = await Chapter.findById(new mongoose.Types.ObjectId(chapterId));

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    // Ensure content exists for the requested language
    const content = chapter.content && chapter.content[lang] ? 
      chapter.content[lang] : 
      (chapter.content && chapter.content.en ? chapter.content.en : []);

    res.json({
      id: chapter._id,
      storyId: chapter.storyId,
      chapterNumber: chapter.chapterNumber,
      title: (chapter.title && chapter.title[lang]) ? chapter.title[lang] : 
             (chapter.title && chapter.title.en ? chapter.title.en : `Chapter ${chapter.chapterNumber}`),
      content: content,
      estimatedReadTime: chapter.estimatedReadTime || 5
    });
  } catch (error) {
    console.error('Chapter fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get trending stories
router.get('/trending', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    
    // First try to get stories marked as trending
    let stories = await Story.find({ 
      status: 'published',
      isTrending: true,
      isDeleted: { $ne: true }
    })
    .sort({ trendingOrder: 1, createdAt: -1 })
    .limit(12);

    // If no trending stories, get latest published stories
    if (stories.length === 0) {
      stories = await Story.find({ 
        status: 'published',
        isDeleted: { $ne: true }
      })
        .sort({ createdAt: -1 })
        .limit(12);
    }

    const formatted = stories.map(story => ({
      _id: story._id,
      title: story.title[lang] || story.title.en,
      author: story.author,
      thumbnail: story.thumbnail,
      category: story.category,
      totalChapters: story.totalChapters,
      rating: story.rating || 4.5,
      reviewCount: story.reviewCount || 0,
      isTrending: story.isTrending || false
    }));

    res.json({ data: formatted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories from stories
router.get('/categories', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    
    // Get all published stories to extract categories
    const stories = await Story.find({ 
      status: 'published',
      isDeleted: { $ne: true }
    });
    
    // Extract unique categories with counts
    const categoryMap = new Map();
    stories.forEach(story => {
      if (story.category) {
        const count = categoryMap.get(story.category) || 0;
        categoryMap.set(story.category, count + 1);
      }
    });
    
    const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
      description: `${count} stories in ${name}`,
      image: `/assets/categories/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      icon: 'Heart'
    }));
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SIMPLE DELETE ROUTE FOR ADMIN (NO AUTH)
router.delete('/delete-story/:id', async (req, res) => {
  try {
    // Hard delete from database
    await Chapter.deleteMany({ storyId: req.params.id });
    await Story.findByIdAndDelete(req.params.id);
    
    console.log(`🗑️ Deleted story: ${req.params.id}`);
    
    res.json({
      success: true,
      message: 'Story deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
