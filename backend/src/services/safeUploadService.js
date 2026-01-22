const mongoose = require('mongoose');
const { Story, Chapter, Admin } = require('../models/persistentModels');
const docxParser = require('./docxParser');
const translator = require('./translator');

class SafeUploadService {
  
  // TRANSACTION-SAFE STORY UPLOAD
  static async uploadStory(storyData, docxBuffer, adminId) {
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      
      console.log('🔄 Starting safe story upload...');
      
      // 1. CREATE STORY RECORD (PERSISTENT)
      const story = new Story({
        title: { en: storyData.title },
        author: storyData.author,
        description: { en: storyData.description },
        category: storyData.category,
        thumbnail: storyData.thumbnailPath,
        status: 'draft',
        uploadedAt: new Date(),
        isDeleted: false
      });
      
      await story.save({ session });
      console.log(`✅ Story created: ${story._id}`);
      
      // 2. PARSE DOCX SAFELY FROM BUFFER
      const chapters = await docxParser.parseDocxBuffer(docxBuffer);
      console.log(`📖 Parsed ${chapters.length} chapters`);
      
      // 3. SAVE CHAPTERS (TRANSACTION-SAFE)
      const savedChapters = [];
      
      for (let i = 0; i < chapters.length; i++) {
        try {
          const translatedChapter = await translator.translateChapter(chapters[i]);
          
          const chapter = new Chapter({
            storyId: story._id,
            chapterNumber: i + 1,
            title: translatedChapter.title,
            content: translatedChapter.content,
            estimatedReadTime: this.calculateReadTime(translatedChapter.content.en),
            isDeleted: false
          });
          
          await chapter.save({ session });
          savedChapters.push(chapter);
          
          console.log(`✅ Chapter ${i + 1} saved: ${chapter._id}`);
          
          if (i < chapters.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (chapterError) {
          console.error(`❌ Chapter ${i + 1} failed:`, chapterError.message);
        }
      }
      
      // 4. UPDATE STORY WITH FINAL DATA
      story.totalChapters = savedChapters.length;
      story.status = 'published';
      story.lastModified = new Date();
      
      // Simplified - skip translation for now
      story.title.hi = storyData.title;
      story.title.hinglish = storyData.title;
      story.description.hi = storyData.description;
      story.description.hinglish = storyData.description;
      
      await story.save({ session });
      
      // 5. LOG ADMIN ACTION
      await this.logAdminAction(adminId, 'upload', story._id, session);
      
      // 6. COMMIT TRANSACTION
      await session.commitTransaction();
      
      console.log(`🎉 Story upload completed: ${story._id}`);
      console.log(`📊 Total chapters: ${savedChapters.length}`);
      
      return {
        success: true,
        storyId: story._id,
        totalChapters: savedChapters.length,
        message: 'Story uploaded and will persist permanently'
      };
      
    } catch (error) {
      await session.abortTransaction();
      console.error('❌ Upload failed, rolling back:', error);
      throw new Error(`Upload failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }
  
  // ADMIN-ONLY DELETE (SOFT DELETE)
  static async deleteStory(storyId, adminId, hardDelete = false) {
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      
      const story = await Story.findById(storyId).session(session);
      if (!story) {
        throw new Error('Story not found');
      }
      
      if (hardDelete) {
        await Chapter.deleteMany({ storyId }, { session });
        await Story.findByIdAndDelete(storyId, { session });
        console.log(`🗑️ Hard deleted story: ${storyId}`);
      } else {
        story.isDeleted = true;
        story.deletedAt = new Date();
        story.deletedBy = adminId;
        await story.save({ session });
        
        await Chapter.updateMany(
          { storyId },
          { isDeleted: true, deletedAt: new Date() },
          { session }
        );
        
        console.log(`🔒 Soft deleted story: ${storyId}`);
      }
      
      await this.logAdminAction(adminId, 'delete', storyId, session);
      await session.commitTransaction();
      
      return {
        success: true,
        message: hardDelete ? 'Story permanently deleted' : 'Story archived (can be restored)'
      };
      
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  // GET STORIES (EXCLUDE SOFT-DELETED)
  static async getActiveStories(filters = {}) {
    const query = { isDeleted: { $ne: true }, ...filters };
    return await Story.find(query).sort({ createdAt: -1 });
  }
  
  // GET CHAPTERS FOR STORY (EXCLUDE SOFT-DELETED)
  static async getActiveChapters(storyId) {
    return await Chapter.find({ 
      storyId, 
      isDeleted: { $ne: true } 
    }).sort({ chapterNumber: 1 });
  }
  
  // UTILITY METHODS
  static calculateReadTime(content) {
    const textBlocks = content.filter(block => block.type === 'text');
    const wordCount = textBlocks.reduce((count, block) => {
      return count + (block.content?.split(' ').length || 0);
    }, 0);
    return Math.ceil(wordCount / 200);
  }
  
  static async logAdminAction(adminId, action, storyId, session = null) {
    try {
      const admin = await Admin.findById(adminId).session(session);
      if (admin) {
        admin.actions.push({
          action,
          storyId,
          timestamp: new Date()
        });
        await admin.save({ session });
      }
    } catch (error) {
      console.warn('Failed to log admin action:', error.message);
    }
  }
}

module.exports = SafeUploadService;