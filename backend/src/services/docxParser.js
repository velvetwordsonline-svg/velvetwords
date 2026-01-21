const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

class DocxParser {
  async parseDocx(filePath) {
    const buffer = await fs.readFile(filePath);
    
    // Extract images and text
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          const imageBuffer = await image.read();
          const imageName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${image.contentType.split('/')[1]}`;
          const imagePath = path.join(process.env.PUBLIC_DIR, 'images', imageName);
          
          await fs.writeFile(imagePath, imageBuffer);
          return { src: `/images/${imageName}` };
        })
      }
    );

    return this.parseHtmlToBlocks(result.value);
  }

  parseHtmlToBlocks(html) {
    const chapters = [];
    let order = 0;

    // Enhanced chapter detection patterns
    const chapterPatterns = [
      /^(Chapter\s+\d+[:.\s]*.*?)$/gim,
      /^(\d+[:.\s]+.*?)$/gm,
      /^(CHAPTER\s+\d+[:.\s]*.*?)$/gim,
      /<h[1-3][^>]*>(Chapter\s+\d+[:.\s]*.*?)<\/h[1-3]>/gi,
      /<h[1-3][^>]*>(\d+[:.\s]+.*?)<\/h[1-3]>/gi,
      /<p[^>]*><strong>(Chapter\s+\d+[:.\s]*.*?)<\/strong><\/p>/gi,
      /<p[^>]*><b>(Chapter\s+\d+[:.\s]*.*?)<\/b><\/p>/gi
    ];

    let currentChapter = null;
    let chapterCount = 0;

    // Clean and split HTML into processable segments
    const segments = html
      .replace(/<br\s*\/?>/gi, '\n')
      .split(/(<p[^>]*>.*?<\/p>|<h[1-6][^>]*>.*?<\/h[1-6]>|<img[^>]*>)/gi)
      .filter(segment => segment.trim());

    segments.forEach(segment => {
      let isChapterStart = false;
      let chapterTitle = '';

      // Check for chapter patterns
      for (const pattern of chapterPatterns) {
        const match = segment.match(pattern);
        if (match) {
          chapterTitle = match[1] || match[0];
          chapterTitle = chapterTitle.replace(/<\/?[^>]+(>|$)/g, '').trim();
          isChapterStart = true;
          break;
        }
      }

      // Also check plain text for chapter markers
      if (!isChapterStart) {
        const plainText = segment.replace(/<\/?[^>]+(>|$)/g, '').trim();
        if (/^(Chapter\s+\d+|\d+\.|CHAPTER\s+\d+)/i.test(plainText) && plainText.length < 100) {
          chapterTitle = plainText;
          isChapterStart = true;
        }
      }

      if (isChapterStart) {
        // Save previous chapter
        if (currentChapter && currentChapter.blocks.length > 0) {
          chapters.push(currentChapter);
        }
        
        chapterCount++;
        currentChapter = {
          title: chapterTitle || `Chapter ${chapterCount}`,
          blocks: []
        };
      } else if (segment.trim()) {
        // Process content blocks
        if (segment.includes('<img')) {
          const srcMatch = segment.match(/src=["']([^"']+)["']/i);
          if (srcMatch) {
            if (!currentChapter) {
              currentChapter = { title: 'Chapter 1', blocks: [] };
            }
            currentChapter.blocks.push({
              type: 'image',
              order: order++,
              data: srcMatch[1]
            });
          }
        } else if (segment.includes('<p') || segment.includes('<h')) {
          const text = segment
            .replace(/<\/?[^>]+(>|$)/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (text && text.length > 5) {
            if (!currentChapter) {
              currentChapter = { title: 'Chapter 1', blocks: [] };
            }
            currentChapter.blocks.push({
              type: 'text',
              order: order++,
              data: text
            });
          }
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

    console.log(`✅ Parsed ${chapters.length} chapters`);
    chapters.forEach((ch, i) => {
      console.log(`   Chapter ${i + 1}: "${ch.title}" (${ch.blocks.length} blocks)`);
    });
    
    return chapters;
  }
}

module.exports = new DocxParser();
