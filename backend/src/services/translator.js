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
      // Optimize content - remove empty blocks and compress text
      const optimizedBlocks = chapter.blocks
        .filter(block => block.data && block.data.trim().length > 0)
        .map(block => ({
          type: block.type,
          data: block.data.trim(),
          order: block.order
        }));
      
      return {
        title: {
          en: chapter.title.trim()
        },
        content: {
          en: optimizedBlocks
        }
      };
    } catch (error) {
      console.error('Translation failed:', error);
      return {
        title: { en: chapter.title || 'Untitled' },
        content: { en: [] }
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
