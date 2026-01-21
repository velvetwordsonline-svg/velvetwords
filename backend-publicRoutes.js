const express = require('express');
const { Story, Chapter } = require('./models');

const router = express.Router();

// Get all published stories
router.get('/stories', async (req, res) => {
  try {
    const { lang = 'en', category } = req.query;
    const query = { status: 'published' };
    if (category) query.category = category;

    const stories = await Story.find(query).sort({ createdAt: -1 });
    
    // Format response based on language
    const formatted = stories.map(story => ({
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
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single story by ID
router.get('/stories/:id', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({
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
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chapters for a story
router.get('/stories/:id/chapters', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const chapters = await Chapter.find({ storyId: req.params.id })
      .sort({ chapterNumber: 1 });

    const formatted = chapters.map(chapter => ({
      id: chapter._id,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title[lang] || chapter.title.en,
      estimatedReadTime: chapter.estimatedReadTime
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single chapter content
router.get('/chapters/:id', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    res.json({
      id: chapter._id,
      chapterNumber: chapter.chapterNumber,
      title: chapter.title[lang] || chapter.title.en,
      content: chapter.content[lang] || chapter.content.en,
      estimatedReadTime: chapter.estimatedReadTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending stories
router.get('/trending', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const stories = await Story.find({ status: 'published' })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(12);

    const formatted = stories.map(story => ({
      id: story._id,
      title: story.title[lang] || story.title.en,
      author: story.author,
      thumbnail: story.thumbnail,
      category: story.category,
      rating: story.rating,
      isTrending: true
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
