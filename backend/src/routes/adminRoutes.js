const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { Story, Chapter, User } = require('../models/models');
const docxParser = require('../services/docxParser');
const translator = require('../services/translator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get admin stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [storiesCount, usersCount] = await Promise.all([
      Story.countDocuments(),
      User.countDocuments()
    ]);
    res.json({ stories: storiesCount, users: usersCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Multer configuration - FIXED PATHS
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = file.fieldname === 'thumbnail' ? './uploads/thumbnails' : './uploads';
    await fs.mkdir(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only images allowed for thumbnail'));
      }
    } else if (file.fieldname === 'document') {
      if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
      } else {
        cb(new Error('Only DOCX files allowed'));
      }
    }
  }
});

// Upload story with DOCX
router.post('/upload-story', authMiddleware, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, description, category } = req.body;
    const thumbnailPath = req.files.thumbnail ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}` : null;
    const docxPath = req.files.document[0].path;

    // Parse DOCX
    console.log('Parsing DOCX...');
    const chapters = await docxParser.parseDocx(docxPath);

    // Create story
    const story = new Story({
      title: { en: title },
      author,
      description: { en: description },
      category,
      thumbnail: thumbnailPath,
      totalChapters: chapters.length,
      status: 'draft'
    });
    await story.save();

    console.log(`Created story with ${chapters.length} chapters`);

    // Translate and save chapters
    console.log('Translating chapters...');
    for (let i = 0; i < chapters.length; i++) {
      try {
        const translatedChapter = await translator.translateChapter(chapters[i]);
        
        const chapter = new Chapter({
          storyId: story._id,
          chapterNumber: i + 1,
          title: translatedChapter.title,
          content: translatedChapter.content,
          estimatedReadTime: Math.ceil(translatedChapter.content.en.filter(b => b.type === 'text').length / 200 * 10)
        });
        await chapter.save();
        console.log(`Saved chapter ${i + 1}: ${chapter._id}`);

        // Add delay to avoid rate limits
        if (i < chapters.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error saving chapter ${i + 1}:`, error);
        // Continue with next chapter
      }
    }

    // Translate story metadata
    const [hiTitle, hinglishTitle, hiDesc, hinglishDesc] = await Promise.all([
      translator.translateToHindi(title),
      translator.translateToHinglish(title),
      translator.translateToHindi(description),
      translator.translateToHinglish(description)
    ]);

    story.title.hi = hiTitle;
    story.title.hinglish = hinglishTitle;
    story.description.hi = hiDesc;
    story.description.hinglish = hinglishDesc;
    story.status = 'published';
    await story.save();

    // Cleanup uploaded DOCX
    await fs.unlink(docxPath);

    res.json({ 
      success: true, 
      storyId: story._id,
      message: 'Story uploaded and translated successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all stories (admin view)
router.get('/stories', authMiddleware, async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update trending status - TEMP: No auth for testing
router.put('/stories/:id/trending', async (req, res) => {
  try {
    const { isTrending, trendingOrder } = req.body;
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { isTrending, trendingOrder: trendingOrder || 0 },
      { new: true }
    );
    res.json({ success: true, story });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trending stories management
router.get('/trending', authMiddleware, async (req, res) => {
  try {
    const trendingStories = await Story.find({ isTrending: true })
      .sort({ trendingOrder: 1, createdAt: -1 });
    const allStories = await Story.find({ status: 'published' })
      .sort({ createdAt: -1 });
    res.json({ trending: trendingStories, all: allStories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete story
router.delete('/stories/:id', authMiddleware, async (req, res) => {
  try {
    await Chapter.deleteMany({ storyId: req.params.id });
    await Story.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
