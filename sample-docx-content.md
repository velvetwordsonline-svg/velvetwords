# Sample DOCX Content for Testing Chapter Detection

Create a DOCX file with this content to test automatic chapter detection:

---

**Chapter 1: The Beginning**

This is the first chapter of our test story. It contains some introductory content that will help us verify that the DOCX parser is working correctly.

The parser should detect this as Chapter 1 and create a separate chapter entry in the database.

**Chapter 2: The Journey Continues**

This is the second chapter. It should be automatically detected and separated from the first chapter.

Each chapter will be stored as a separate document in the MongoDB chapters collection, linked to the main story via storyId.

**Chapter 3: The Climax**

The third chapter represents the climax of our story. This content should also be automatically parsed and stored.

The system will translate this content to Hindi and Hinglish automatically.

**Chapter 4: The Resolution**

This final chapter concludes our test story. After uploading this DOCX file, you should see:

1. One story entry in the stories collection
2. Four chapter entries in the chapters collection
3. All content translated to multiple languages
4. Chapters accessible through the reader interface

---

## Instructions:

1. Copy this content into a Word document
2. Save as .docx format
3. Upload through the admin panel
4. Check the reader to see if chapters appear correctly

## Expected Results:

- 4 chapters should be created
- Each chapter should have proper titles
- Content should be split correctly
- Reader should show chapter navigation
- First chapter should be free, others require subscription