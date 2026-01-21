# 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN DASHBOARD                             │
│                     (Next.js Admin Panel)                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Upload DOCX + Thumbnail
                             │ JWT Authentication
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS BACKEND                             │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Admin      │  │   Public     │  │    Auth      │               │
│  │   Routes     │  │   Routes     │  │  Middleware  │               │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘               │
│         │                  │                                        │
│         ▼                  ▼                                        │
│  ┌──────────────────────────────────────────────┐                   │
│  │           PROCESSING PIPELINE                │                   │
│  │                                              │                   │
│  │  1. DOCX Parser (Mammoth.js)                 │                   │
│  │     ├─ Extract chapters                      │                   │
│  │     ├─ Extract text blocks                   │                   │
│  │     └─ Extract embedded images               │                   │
│  │                                              │                   │
│  │  2. Image Processor                          │                   │
│  │     ├─ Save images to /public/images         │                   │
│  │     └─ Optimize (optional: Sharp)            │                   │
│  │                                              │                   │
│  │  3. Translation Service                      │                   │
│  │     ├─ Translate to Hindi                    │                   │
│  │     ├─ Translate to Hinglish                 │                   │
│  │     └─ Batch processing with delays          │                   │
│  │                                              │                   │
│  │  4. Database Writer                          │                   │
│  │     ├─ Create Story document                 │                   │
│  │     └─ Create Chapter documents              │                   │
│  └──────────────────────────────────────────────┘                   │
│                                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Store Data
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        MONGODB DATABASE                             │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │  Stories        │  │  Chapters       │  │  Admins         │      │
│  │  Collection     │  │  Collection     │  │  Collection     │      │
│  │                 │  │                 │  │                 │      │ 
│  │  {             │  │  {             │  │  {             │   │
│  │   title: {     │  │   storyId,     │  │   username,    │   │
│  │    en: "...",  │  │   number: 1,   │  │   password,    │   │
│  │    hi: "...",  │  │   title: {     │  │   email        │   │
│  │    hinglish    │  │    en: "...",  │  │  }             │   │
│  │   },           │  │    hi: "...",  │  │                 │   │
│  │   author,      │  │    hinglish    │  │                 │   │
│  │   thumbnail,   │  │   },           │  │                 │   │
│  │   category     │  │   content: {   │  │                 │        │
│  │  }             │  │    en: [...],  │  │                 │        │
│  │                 │  │    hi: [...],  │  │                 │       │
│  │                 │  │    hinglish    │  │                 │       │
│  │                 │  │   }            │  │                 │       │
│  │                 │  │  }             │  │                 │       │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│                                                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ Fetch Data
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PUBLIC API LAYER                                │
│                                                                      │
│  GET /api/stories?lang=en                                           │
│  GET /api/stories/:id?lang=hi                                       │
│  GET /api/stories/:id/chapters?lang=hinglish                        │
│  GET /api/chapters/:id?lang=en                                      │
│                                                                      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ JSON Response
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS FRONTEND                                │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Home       │  │   Story      │  │   Reader     │             │
│  │   Page       │  │   Detail     │  │   Page       │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                      │
│  ┌────────────────────────────────────────────────┐                │
│  │        Language Context Provider                │                │
│  │                                                 │                │
│  │  [English] [हिंदी] [Hinglish]                 │                │
│  │                                                 │                │
│  │  Selected: language state                      │                │
│  │  Updates: All API calls include ?lang=X        │                │
│  └────────────────────────────────────────────────┘                │
│                                                                      │
│  ┌────────────────────────────────────────────────┐                │
│  │           Story Reader Component                │                │
│  │                                                 │                │
│  │  {chapter.content.map(block => (               │                │
│  │    block.type === 'text' ?                     │                │
│  │      <p>{block.data}</p> :                     │                │
│  │      <img src={block.data} />                  │                │
│  │  ))}                                            │                │
│  └────────────────────────────────────────────────┘                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                          DATA FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════════

UPLOAD FLOW:
───────────

Admin → Upload DOCX
   │
   ├─→ Parse DOCX (Mammoth.js)
   │      │
   │      ├─→ Extract: Chapter 1
   │      │      ├─ Text Block 1
   │      │      ├─ Image Block 1
   │      │      └─ Text Block 2
   │      │
   │      └─→ Extract: Chapter 2
   │             ├─ Text Block 1
   │             └─ Text Block 2
   │
   ├─→ Translate Each Text Block
   │      │
   │      ├─→ English (original)
   │      ├─→ Hindi (Google Translate)
   │      └─→ Hinglish (Transliterate)
   │
   └─→ Save to MongoDB
          │
          ├─→ Story Document
          │      {title: {en, hi, hinglish}, ...}
          │
          └─→ Chapter Documents
                 {content: {en: [...], hi: [...], hinglish: [...]}}


READING FLOW:
─────────────

User → Select Language (EN/HI/Hinglish)
   │
   ├─→ Fetch Stories (?lang=en)
   │      │
   │      └─→ MongoDB Query
   │             │
   │             └─→ Return: story.title[lang]
   │
   ├─→ Select Story
   │      │
   │      └─→ Fetch Chapters (?lang=hi)
   │             │
   │             └─→ Return: chapter.title[lang]
   │
   └─→ Read Chapter
          │
          └─→ Fetch Content (?lang=hinglish)
                 │
                 └─→ Return: chapter.content[lang]
                        │
                        └─→ Render:
                              [Text] → <p>
                              [Image] → <img>
                              [Text] → <p>


═══════════════════════════════════════════════════════════════════════
                        CONTENT BLOCK STRUCTURE
═══════════════════════════════════════════════════════════════════════

DOCX Input:
───────────
Chapter 1: The Beginning

First paragraph of text.

[Embedded Image]

Second paragraph of text.


Parsed Output:
──────────────
{
  title: "Chapter 1: The Beginning",
  blocks: [
    {
      type: "text",
      order: 0,
      data: "First paragraph of text."
    },
    {
      type: "image",
      order: 1,
      data: "/images/img-123.jpg"
    },
    {
      type: "text",
      order: 2,
      data: "Second paragraph of text."
    }
  ]
}


Translated Output (Hindi):
──────────────────────────
{
  title: {
    en: "Chapter 1: The Beginning",
    hi: "अध्याय 1: शुरुआत",
    hinglish: "Adhyay 1: Shuruaat"
  },
  content: {
    en: [
      {type: "text", order: 0, data: "First paragraph of text."},
      {type: "image", order: 1, data: "/images/img-123.jpg"},
      {type: "text", order: 2, data: "Second paragraph of text."}
    ],
    hi: [
      {type: "text", order: 0, data: "पाठ का पहला पैराग्राफ।"},
      {type: "image", order: 1, data: "/images/img-123.jpg"},
      {type: "text", order: 2, data: "पाठ का दूसरा पैराग्राफ।"}
    ],
    hinglish: [
      {type: "text", order: 0, data: "Paath ka pehla paragraph."},
      {type: "image", order: 1, data: "/images/img-123.jpg"},
      {type: "text", order: 2, data: "Paath ka doosra paragraph."}
    ]
  }
}


═══════════════════════════════════════════════════════════════════════
                         TECHNOLOGY STACK
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Next.js    │  │  Tailwind    │  │   React      │         │
│  │   (React)    │  │     CSS      │  │   Context    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Node.js    │  │   Express    │  │   Multer     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Mammoth.js  │  │   JWT Auth   │  │   bcryptjs   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       TRANSLATION                                │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  @vitalets/google-translate-api (FREE)              │       │
│  │  - No API key required                               │       │
│  │  - Unlimited translations                            │       │
│  │  - Hindi + Hinglish support                          │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  MongoDB (FREE 512MB on Atlas)                       │       │
│  │  - Stories Collection                                │       │
│  │  - Chapters Collection                               │       │
│  │  - Admins Collection                                 │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         HOSTING                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Vercel     │  │   Railway    │  │   MongoDB    │         │
│  │  (Frontend)  │  │  (Backend)   │  │    Atlas     │         │
│  │    FREE      │  │    FREE      │  │    FREE      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                    TOTAL COST: $0/month 💰
═══════════════════════════════════════════════════════════════════════
```
