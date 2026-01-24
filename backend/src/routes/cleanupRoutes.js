const express = require('express');
const router = express.Router();
const { PersistentStory, PersistentChapter } = require('../models/persistentModels');

// Clean database - remove Hindi/Hinglish content, keep only English
router.post('/cleanup-database', async (req, res) => {
  try {
    console.log('Starting database cleanup...');
    
    // Update all stories to keep only English content
    const stories = await PersistentStory.find({});
    
    for (let story of stories) {
      let updated = false;
      
      // Clean title - keep only English
      if (story.title && typeof story.title === 'object') {
        story.title = story.title.en || story.title;
        updated = true;
      }
      
      // Clean description - keep only English
      if (story.description && typeof story.description === 'object') {
        story.description = story.description.en || story.description;
        updated = true;
      }
      
      if (updated) {
        await story.save();
        console.log(`Updated story: ${story.title}`);
      }
    }
    
    // Update all chapters to keep only English content
    const chapters = await PersistentChapter.find({});
    
    for (let chapter of chapters) {
      let updated = false;
      
      // Clean title - keep only English
      if (chapter.title && typeof chapter.title === 'object') {
        chapter.title = chapter.title.en || chapter.title;
        updated = true;
      }
      
      // Clean content - keep only English
      if (chapter.content && typeof chapter.content === 'object') {
        chapter.content = chapter.content.en || chapter.content;
        updated = true;
      }
      
      if (updated) {
        await chapter.save();
        console.log(`Updated chapter: ${chapter.title}`);
      }
    }
    
    console.log('Database cleanup completed!');
    res.json({ 
      success: true, 
      message: 'Database cleaned successfully - only English content retained',
      storiesUpdated: stories.length,
      chaptersUpdated: chapters.length
    });
    
  } catch (error) {
    console.error('Database cleanup error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;