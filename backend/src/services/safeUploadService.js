const mongoose = require('mongoose');
const { Story, Chapter, Admin } = require('../models/persistentModels');
const docxParser = require('./docxParser');
const translator = require('./translator');

class SafeUploadService {
  
  // TRANSACTION-SAFE STORY UPLOAD (OPTIMIZED)
  static async uploadStory(storyData, docxBuffer, adminId) {
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      
      console.log('🔄 Starting optimized story upload...');
      
      // 1. CREATE STORY RECORD (MINIMAL DATA)
      const story = new Story({
        title: { en: storyData.title.trim() },
        author: storyData.author.trim(),
        description: { en: storyData.description.trim() },
        category: storyData.category,
        thumbnail: storyData.thumbnailPath,
        status: 'processing', // Changed from draft
        uploadedAt: new Date(),
        isDeleted: false
      });
      
      await story.save({ session });
      console.log(`✅ Story created: ${story._id}`);
      
      // 2. COMMIT STORY FIRST (MAKES IT VISIBLE IMMEDIATELY)
      await session.commitTransaction();
      
      // 3. PROCESS CHAPTERS ASYNCHRONOUSLY (NON-BLOCKING)
      setImmediate(async () => {
        try {
          await this.processChaptersAsync(story._id, docxBuffer, adminId);
        } catch (error) {
          console.error('Async chapter processing failed:', error);
        }
      });
      
      return {
        success: true,
        storyId: story._id,
        message: 'Story uploaded, chapters processing in background'
      };
      
    } catch (error) {
      await session.abortTransaction();
      console.error('❌ Upload failed:', error);
      throw new Error(`Upload failed: ${error.message}`);
    } finally {
      session.endSession();
    }
  }
  
  // ASYNC CHAPTER PROCESSING (NON-BLOCKING)
  static async processChaptersAsync(storyId, docxBuffer, adminId) {
    try {
      console.log(`🔄 Processing chapters for story: ${storyId}`);
      
      // Parse chapters
      const chapters = await docxParser.parseDocxBuffer(docxBuffer);
      console.log(`📖 Parsed ${chapters.length} chapters`);
      
      const savedChapters = [];
      
      // Process chapters in batches to avoid memory issues
      const batchSize = 3;
      for (let i = 0; i < chapters.length; i += batchSize) {
        const batch = chapters.slice(i, i + batchSize);
        
        for (let j = 0; j < batch.length; j++) {
          const chapterIndex = i + j;
          try {
            const translatedChapter = await translator.translateChapter(batch[j]);
            
            const chapter = new Chapter({
              storyId,
              chapterNumber: chapterIndex + 1,
              title: translatedChapter.title,
              content: translatedChapter.content,
              estimatedReadTime: this.calculateReadTime(translatedChapter.content.en),
              isDeleted: false
            });
            
            await chapter.save();
            savedChapters.push(chapter);
            
            console.log(`✅ Chapter ${chapterIndex + 1} saved`);
            
          } catch (chapterError) {
            console.error(`❌ Chapter ${chapterIndex + 1} failed:`, chapterError.message);
          }
        }
        
        // Small delay between batches
        if (i + batchSize < chapters.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Update story with final data
      await Story.findByIdAndUpdate(storyId, {
        totalChapters: savedChapters.length,
        status: 'published',
        lastModified: new Date()
      });
      
      await this.logAdminAction(adminId, 'upload', storyId);
      
      console.log(`🎉 Story processing completed: ${storyId}`);
      
    } catch (error) {
      console.error('❌ Async processing failed:', error);
      // Mark story as failed
      await Story.findByIdAndUpdate(storyId, {
        status: 'failed',
        lastModified: new Date()
      });
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
    if (!content || !Array.isArray(content)) return 5;
    
    const textBlocks = content.filter(block => block.type === 'text' && block.data);
    const wordCount = textBlocks.reduce((count, block) => {
      return count + (block.data?.split(' ').length || 0);
    }, 0);
    
    return Math.max(1, Math.ceil(wordCount / 200)); // Minimum 1 minute
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