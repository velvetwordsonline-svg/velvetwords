const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

class DocxParser {
  async parseDocx(filePath) {
    const buffer = await fs.readFile(filePath);
    return this.parseDocxBuffer(buffer);
  }

  async parseDocxBuffer(buffer) {
    // Extract images and text from buffer
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          // For Vercel, we'll convert images to base64 instead of saving to disk
          const imageBuffer = await image.read();
          const base64 = imageBuffer.toString('base64');
          const mimeType = image.contentType || 'image/jpeg';
          return { src: `data:${mimeType};base64,${base64}` };
        })
      }
    );

    return this.parseHtmlToBlocks(result.value);
  }

  parseHtmlToBlocks(html) {
    const chapters = [];
    let order = 0;
    let currentChapter = null;
    let chapterCount = 0;

    // Split content by paragraphs and headings
    const segments = html
      .replace(/<br\s*\/?>/gi, '\n')
      .split(/(<p[^>]*>.*?<\/p>|<h[1-6][^>]*>.*?<\/h[1-6]>|<img[^>]*>)/gi)
      .filter(segment => segment.trim());

    segments.forEach(segment => {
      const plainText = segment.replace(/<\/?[^>]+(>|$)/g, '').trim();
      
      // Check if this is a chapter heading
      const isChapterHeading = /^(Chapter\s+\d+|CHAPTER\s+\d+|\d+\s*[:.\-])/i.test(plainText) && plainText.length < 100;
      
      if (isChapterHeading) {
        // Save previous chapter
        if (currentChapter && currentChapter.blocks.length > 0) {
          chapters.push(currentChapter);
        }
        
        chapterCount++;
        // Always format as "Chapter X" regardless of original format
        currentChapter = {
          title: `Chapter ${chapterCount}`,
          blocks: []
        };
      } else if (segment.trim()) {
        // Process content blocks
        if (segment.includes('<img')) {
          const srcMatch = segment.match(/src=["']([^"']+)["']/i);
          if (srcMatch) {
            if (!currentChapter) {
              chapterCount++;
              currentChapter = { title: `Chapter ${chapterCount}`, blocks: [] };
            }
            currentChapter.blocks.push({
              type: 'image',
              order: order++,
              data: srcMatch[1]
            });
          }
        } else if (plainText && plainText.length > 5) {
          if (!currentChapter) {
            chapterCount++;
            currentChapter = { title: `Chapter ${chapterCount}`, blocks: [] };
          }
          currentChapter.blocks.push({
            type: 'text',
            order: order++,
            data: plainText
          });
        }
      }
    });

    // Add final chapter
    if (currentChapter && currentChapter.blocks.length > 0) {
      chapters.push(currentChapter);
    }

    // Fallback: create single chapter if none detected
    if (chapters.length === 0) {
      const allText = html.replace(/<\/?[^>]+(>|$)/g, ' ').replace(/\s+/g, ' ').trim();
      if (allText) {
        chapters.push({
          title: 'Chapter 1',
          blocks: [{ type: 'text', order: 0, data: allText }]
        });
      }
    }

    // Ensure all chapters have proper numbering
    chapters.forEach((chapter, index) => {
      chapter.title = `Chapter ${index + 1}`;
    });

    console.log(`✅ Parsed ${chapters.length} chapters`);
    chapters.forEach((ch, i) => {
      console.log(`   ${ch.title} (${ch.blocks.length} blocks)`);
    });
    
    return chapters;
  }
}

module.exports = new DocxParser();
