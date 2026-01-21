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
    const blocks = [];
    let order = 0;

    // Split by chapter markers (assuming chapters start with h1 or specific pattern)
    const chapterRegex = /<h1>(Chapter \d+:?\s*.*?)<\/h1>/gi;
    const chapters = [];
    let currentChapter = null;

    // Parse HTML into structured blocks
    const lines = html.split(/(<p>.*?<\/p>|<img[^>]+>|<h\d>.*?<\/h\d>)/gi).filter(Boolean);

    lines.forEach(line => {
      if (line.match(chapterRegex)) {
        if (currentChapter) chapters.push(currentChapter);
        currentChapter = {
          title: line.replace(/<\/?h1>/g, '').trim(),
          blocks: []
        };
      } else if (currentChapter) {
        if (line.includes('<img')) {
          const srcMatch = line.match(/src="([^"]+)"/);
          if (srcMatch) {
            currentChapter.blocks.push({
              type: 'image',
              order: order++,
              data: srcMatch[1]
            });
          }
        } else if (line.includes('<p>')) {
          const text = line.replace(/<\/?p>/g, '').trim();
          if (text) {
            currentChapter.blocks.push({
              type: 'text',
              order: order++,
              data: text
            });
          }
        }
      }
    });

    if (currentChapter) chapters.push(currentChapter);
    return chapters;
  }
}

module.exports = new DocxParser();
