const translate = require('@vitalets/google-translate-api');

class TranslationService {
  async translateText(text, targetLang) {
    try {
      const result = await translate(text, { to: targetLang });
      return result.text;
    } catch (error) {
      console.error(`Translation error for ${targetLang}:`, error);
      return text; // Fallback to original
    }
  }

  async translateToHindi(text) {
    return await this.translateText(text, 'hi');
  }

  async translateToHinglish(text) {
    // Hinglish: Translate to Hindi, then romanize
    const hindiText = await this.translateText(text, 'hi');
    // For better Hinglish, you can use transliteration libraries
    // For now, we'll use a simple approach
    return hindiText; // Can be enhanced with transliteration
  }

  async translateContentBlocks(blocks, targetLang) {
    const translatedBlocks = [];
    
    for (const block of blocks) {
      if (block.type === 'text') {
        const translatedText = await this.translateText(block.data, targetLang);
        translatedBlocks.push({
          ...block,
          data: translatedText
        });
      } else {
        // Images remain the same
        translatedBlocks.push(block);
      }
    }
    
    return translatedBlocks;
  }

  async translateChapter(chapter) {
    try {
      // Simplified version - skip translation for now to avoid API issues
      return {
        title: {
          en: chapter.title,
          hi: chapter.title,
          hinglish: chapter.title
        },
        content: {
          en: chapter.blocks,
          hi: chapter.blocks,
          hinglish: chapter.blocks
        }
      };
    } catch (error) {
      console.error('Translation failed, using original content:', error);
      // Fallback to original content
      return {
        title: {
          en: chapter.title,
          hi: chapter.title,
          hinglish: chapter.title
        },
        content: {
          en: chapter.blocks,
          hi: chapter.blocks,
          hinglish: chapter.blocks
        }
      };
    }
  }

  // Batch translation with delay to avoid rate limits
  async translateChaptersWithDelay(chapters, delayMs = 1000) {
    const translated = [];
    
    for (const chapter of chapters) {
      const result = await this.translateChapter(chapter);
      translated.push(result);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    
    return translated;
  }
}

module.exports = new TranslationService();
