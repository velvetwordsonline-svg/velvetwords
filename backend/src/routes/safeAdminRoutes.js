const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const SafeUploadService = require('../services/safeUploadService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// SAFE MULTER CONFIGURATION
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

// SAFE STORY UPLOAD - PERSISTENT STORAGE
router.post('/upload-story', authMiddleware, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, description, category } = req.body;
    const thumbnailPath = req.files.thumbnail ? `/uploads/thumbnails/${req.files.thumbnail[0].filename}` : null;
    const docxPath = req.files.document[0].path;
    const adminId = req.admin.id;

    console.log('📤 Admin upload request:', { title, author, category });
    
    // SAFE UPLOAD WITH TRANSACTION
    const result = await SafeUploadService.uploadStory({
      title,
      author,
      description,
      category,
      thumbnailPath
    }, docxPath, adminId);
    
    // CLEANUP TEMP FILE
    try {
      await fs.unlink(docxPath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError.message);
    }
    
    res.json({
      success: true,
      storyId: result.storyId,
      totalChapters: result.totalChapters,
      message: 'Story uploaded successfully and will persist permanently'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      message: 'Upload failed - existing stories remain safe'
    });
  }
});

// GET ACTIVE STORIES (EXCLUDE SOFT-DELETED)
router.get('/stories', authMiddleware, async (req, res) => {
  try {
    const stories = await SafeUploadService.getActiveStories();
    res.json({
      success: true,
      stories,
      total: stories.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADMIN-ONLY DELETE (SOFT DELETE BY DEFAULT)
router.delete('/stories/:id', authMiddleware, async (req, res) => {
  try {
    const { hardDelete } = req.query;
    const adminId = req.admin.id;
    
    const result = await SafeUploadService.deleteStory(
      req.params.id, 
      adminId, 
      hardDelete === 'true'
    );
    
    res.json({
      success: true,
      message: result.message,
      type: hardDelete === 'true' ? 'permanent' : 'soft'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// UPDATE TRENDING STATUS
router.put('/stories/:id/trending', authMiddleware, async (req, res) => {
  try {
    const { isTrending, trendingOrder } = req.body;
    const { Story } = require('../models/persistentModels');
    
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { 
        isTrending, 
        trendingOrder: trendingOrder || 0,
        lastModified: new Date()
      },
      { new: true }
    );
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.json({ 
      success: true, 
      story,
      message: 'Trending status updated'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET TRENDING STORIES
router.get('/trending', authMiddleware, async (req, res) => {
  try {
    const trendingStories = await SafeUploadService.getActiveStories({ 
      isTrending: true 
    });
    
    const allStories = await SafeUploadService.getActiveStories({ 
      status: 'published' 
    });
    
    res.json({ 
      success: true,
      trending: trendingStories.sort((a, b) => a.trendingOrder - b.trendingOrder),
      all: allStories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;