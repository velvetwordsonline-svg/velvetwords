const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const SafeUploadService = require('../services/safeUploadService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// SAFE MULTER CONFIGURATION - MEMORY STORAGE FOR VERCEL
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
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

// SAFE STORY UPLOAD - MEMORY STORAGE FOR VERCEL
router.post('/upload-story', authMiddleware, upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, description, category } = req.body;
    const adminId = req.admin.id;

    console.log('📤 Admin upload request:', { title, author, category });
    
    // Handle thumbnail as base64 or store in database
    let thumbnailPath = null;
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      const thumbnailBuffer = req.files.thumbnail[0].buffer;
      const thumbnailBase64 = `data:${req.files.thumbnail[0].mimetype};base64,${thumbnailBuffer.toString('base64')}`;
      thumbnailPath = thumbnailBase64;
    }
    
    // Handle document buffer
    const docxBuffer = req.files.document[0].buffer;
    
    // SAFE UPLOAD WITH TRANSACTION
    const result = await SafeUploadService.uploadStory({
      title,
      author,
      description,
      category,
      thumbnailPath
    }, docxBuffer, adminId);
    
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

// ADMIN-ONLY DELETE (SOFT DELETE BY DEFAULT) - WITH HARD DELETE OPTION
router.delete('/stories/:id', authMiddleware, async (req, res) => {
  try {
    const { hardDelete } = req.query;
    const adminId = req.admin.id;
    
    console.log(`🗑️ Delete request for story ${req.params.id}, hardDelete: ${hardDelete}`);
    
    const result = await SafeUploadService.deleteStory(
      req.params.id, 
      adminId, 
      hardDelete === 'true'
    );
    
    console.log(`✅ Delete successful: ${result.message}`);
    
    res.json({
      success: true,
      message: result.message,
      type: hardDelete === 'true' ? 'permanent' : 'soft'
    });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// FORCE DELETE WITHOUT AUTH (FOR TESTING)
router.delete('/force-delete/:id', async (req, res) => {
  try {
    const { Story, Chapter } = require('../models/persistentModels');
    
    // Hard delete from database
    await Chapter.deleteMany({ storyId: req.params.id });
    await Story.findByIdAndDelete(req.params.id);
    
    console.log(`🗑️ Force deleted story: ${req.params.id}`);
    
    res.json({
      success: true,
      message: 'Story permanently deleted'
    });
    
  } catch (error) {
    console.error('❌ Force delete error:', error);
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