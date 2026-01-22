const mongoose = require('mongoose');
const { Story, Chapter, Admin } = require('../models/persistentModels');
const docxParser = require('./docxParser');
const translator = require('./translator');

class SafeUploadService {
  
  // TRANSACTION-SAFE STORY UPLOAD
  static async uploadStory(storyData, docxPath, adminId) {
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
        status: 'draft', // Safe default
        uploadedAt: new Date(),
        isDeleted: false // EXPLICIT - NEVER AUTO-DELETE
      });
      
      await story.save({ session });
      console.log(`✅ Story created: ${story._id}`);
      
      // 2. PARSE DOCX SAFELY
      const chapters = await docxParser.parseDocx(docxPath);
      console.log(`📖 Parsed ${chapters.length} chapters`);
      
      // 3. SAVE CHAPTERS (TRANSACTION-SAFE)
      const savedChapters = [];
      
      for (let i = 0; i < chapters.length; i++) {
        try {
          // Translate chapter
          const translatedChapter = await translator.translateChapter(chapters[i]);
          
          const chapter = new Chapter({
            storyId: story._id,
            chapterNumber: i + 1,
            title: translatedChapter.title,
            content: translatedChapter.content,
            estimatedReadTime: this.calculateReadTime(translatedChapter.content.en),
            isDeleted: false // EXPLICIT - PERSISTENT
          });
          
          await chapter.save({ session });
          savedChapters.push(chapter);
          
          console.log(`✅ Chapter ${i + 1} saved: ${chapter._id}`);
          
          // Rate limiting
          if (i < chapters.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
        } catch (chapterError) {
          console.error(`❌ Chapter ${i + 1} failed:`, chapterError.message);
          // Continue with other chapters - don't fail entire upload
        }
      }
      
      // 4. UPDATE STORY WITH FINAL DATA
      story.totalChapters = savedChapters.length;
      story.status = 'published'; // Only after successful upload
      story.lastModified = new Date();
      
      // Translate story metadata
      try {
        const [hiTitle, hinglishTitle, hiDesc, hinglishDesc] = await Promise.all([
          translator.translateToHindi(storyData.title),
          translator.translateToHinglish(storyData.title),
          translator.translateToHindi(storyData.description),
          translator.translateToHinglish(storyData.description)
        ]);
        
        story.title.hi = hiTitle;
        story.title.hinglish = hinglishTitle;
        story.description.hi = hiDesc;
        story.description.hinglish = hinglishDesc;
      } catch (translationError) {
        console.warn('⚠️ Translation failed, keeping English only:', translationError.message);
      }
      
      await story.save({ session });
      
      // 5. LOG ADMIN ACTION (AUDIT TRAIL)
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
      // ROLLBACK ON ERROR - BUT DON'T DELETE EXISTING STORIES
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
        // HARD DELETE - PERMANENT REMOVAL
        await Chapter.deleteMany({ storyId }, { session });
        await Story.findByIdAndDelete(storyId, { session });
        console.log(`🗑️ Hard deleted story: ${storyId}`);
      } else {
        // SOFT DELETE - RECOMMENDED
        story.isDeleted = true;
        story.deletedAt = new Date();
        story.deletedBy = adminId;
        await story.save({ session });
        
        // Soft delete chapters
        await Chapter.updateMany(
          { storyId },
          { isDeleted: true, deletedAt: new Date() },
          { session }
        );
        
        console.log(`🔒 Soft deleted story: ${storyId}`);\n      }\n      \n      // Log admin action\n      await this.logAdminAction(adminId, 'delete', storyId, session);\n      \n      await session.commitTransaction();\n      \n      return {\n        success: true,\n        message: hardDelete ? 'Story permanently deleted' : 'Story archived (can be restored)'\n      };\n      \n    } catch (error) {\n      await session.abortTransaction();\n      throw error;\n    } finally {\n      session.endSession();\n    }\n  }\n  \n  // RESTORE SOFT-DELETED STORY\n  static async restoreStory(storyId, adminId) {\n    const story = await Story.findById(storyId);\n    if (!story || !story.isDeleted) {\n      throw new Error('Story not found or not deleted');\n    }\n    \n    story.isDeleted = false;\n    story.deletedAt = null;\n    story.deletedBy = null;\n    await story.save();\n    \n    // Restore chapters\n    await Chapter.updateMany(\n      { storyId },\n      { $unset: { isDeleted: 1, deletedAt: 1 } }\n    );\n    \n    await this.logAdminAction(adminId, 'restore', storyId);\n    \n    return { success: true, message: 'Story restored successfully' };\n  }\n  \n  // GET STORIES (EXCLUDE SOFT-DELETED)\n  static async getActiveStories(filters = {}) {\n    const query = { isDeleted: { $ne: true }, ...filters };\n    return await Story.find(query).sort({ createdAt: -1 });\n  }\n  \n  // GET CHAPTERS FOR STORY (EXCLUDE SOFT-DELETED)\n  static async getActiveChapters(storyId) {\n    return await Chapter.find({ \n      storyId, \n      isDeleted: { $ne: true } \n    }).sort({ chapterNumber: 1 });\n  }\n  \n  // UTILITY METHODS\n  static calculateReadTime(content) {\n    const textBlocks = content.filter(block => block.type === 'text');\n    const wordCount = textBlocks.reduce((count, block) => {\n      return count + (block.content?.split(' ').length || 0);\n    }, 0);\n    return Math.ceil(wordCount / 200); // 200 words per minute\n  }\n  \n  static async logAdminAction(adminId, action, storyId, session = null) {\n    try {\n      const admin = await Admin.findById(adminId).session(session);\n      if (admin) {\n        admin.actions.push({\n          action,\n          storyId,\n          timestamp: new Date()\n        });\n        await admin.save({ session });\n      }\n    } catch (error) {\n      console.warn('Failed to log admin action:', error.message);\n    }\n  }\n}\n\nmodule.exports = SafeUploadService;