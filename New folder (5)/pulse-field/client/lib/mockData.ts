export interface Chapter {
  id: string;
  storyId: string;
  number: number;
  title: string;
  content: string;
  estimatedReadTime: number;
  images: string[];
  isLocked: boolean;
  createdAt: string;
}

export interface Story {
  id: string;
  categoryId: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalChapters: number;
  genre: string;
  isTrending: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  storyCount: number;
}

export interface User {
  id: string;
  phone: string;
  isVerified: boolean;
  subscription: {
    plan: "none" | "weekly" | "monthly" | "3-month";
    expiresAt: string | null;
    isActive: boolean;
  };
  readingHistory: ReadingProgress[];
  createdAt: string;
}

export interface ReadingProgress {
  storyId: string;
  lastChapterRead: number;
  lastReadPosition: number;
  progressPercentage: number;
  lastReadAt: string;
}

const chapterContent = (chapterNum: number, storyTitle: string): string => {
  return `Chapter ${chapterNum}: ${storyTitle}

The morning sun filtered through the tall windows of the mansion, casting long shadows across the marble floor. Every heartbeat felt like thunder in my chest as I walked down the corridor, my footsteps echoing against the silence.

The air was thick with anticipation, heavy with unspoken words and forbidden desires. I had been warned about him—warned by friends, by family, by my own conscience. But warnings could only do so much when faced with the intensity of his gaze.

When our eyes met, time seemed to stop. The world fell away, leaving only us and the electricity that crackled between our bodies. His dark eyes held secrets, promises, and dangers I wasn't sure I was ready to face.

"You shouldn't be here," he whispered, his voice like velvet wrapped around sharp edges. But he didn't move away. Neither did I.

The tension between us was almost palpable, a living thing that grew with every breath we shared. My mind screamed at me to run, to listen to reason, but my heart—my treacherous heart—wanted to surrender completely.

"I know," I breathed, taking a small step closer. "But here I am."

A dark smile played at the corners of his lips, dangerous and intoxicating. Whatever happened next would change everything. We both knew it. And neither of us could stop it.

The connection we shared was magnetic, irresistible, overwhelming. It was the kind of love that made you question everything you believed about yourself. It was beautiful and terrible and absolutely consuming.

"Are you prepared for what comes next?" he asked, his hand reaching out to brush a strand of hair from my face. His touch was gentle yet possessive, tender yet commanding.

"No," I admitted. "But I want to find out."

The kiss that followed was like nothing I had ever experienced—passionate, desperate, promising everything and nothing all at once. It was the beginning of something I knew would either complete me or destroy me.

In that moment, standing in the shadows of the mansion, I chose to embrace the darkness with him, to dive headfirst into the depths of our connection, consequences be damned.`;
};

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Slow & Emotional Romance",
    description: "Heartfelt stories that build slowly with deep emotional connections",
    image: "/assets/landscape/College Romance.jpg",
    icon: "Heart",
    storyCount: 12,
  },
  {
    id: "cat-2",
    name: "Forbidden & Risky Desire",
    description: "Dangerous attractions and relationships that break all the rules",
    image: "/assets/landscape/Dark Romance.png",
    icon: "Flame",
    storyCount: 15,
  },
  {
    id: "cat-3",
    name: "Midnight & Confession Stories",
    description: "Late-night revelations and secrets shared under the stars",
    image: "/assets/landscape/Paranormal Love Stories.jpg",
    icon: "Zap",
    storyCount: 8,
  },
  {
    id: "cat-4",
    name: "Everyday Chemistry",
    description: "Real-life connections and chemistry in everyday situations",
    image: "/assets/landscape/Bestie Romance.jpg",
    icon: "Heart",
    storyCount: 10,
  },
  {
    id: "cat-5",
    name: "City, Travel & Temporary Love",
    description: "Urban adventures and fleeting romances across the world",
    image: "/assets/landscape/office romance.jpg",
    icon: "Crown",
    storyCount: 7,
  },
  {
    id: "cat-6",
    name: "Power, Identity & Elite Lives",
    description: "High society romances and power dynamics in elite circles",
    image: "/assets/landscape/fAMILY ROMANE .png",
    icon: "Crown",
    storyCount: 9,
  },
];

const storyTitles = [
  "Crimson Hearts",
  "Midnight Desires",
  "Forbidden Passion",
  "Whispered Promises",
  "Enchanted Nights",
  "Dangerous Attraction",
  "Obsidian Dreams",
  "Velvet Confessions",
  "Burning Temptation",
  "Shadow of Desire",
  "Starfire Romance",
  "Wicked Seduction",
  "Eternal Longing",
  "Silk and Secrets",
  "Moonlit Surrender",
  "Blazing Connection",
  "Hidden Depths",
  "Passionate Echoes",
  "Tangled Hearts",
  "Beautiful Chaos",
  "Untamed Love",
  "Infinite Desire",
  "Crimson Fate",
  "Silver Lining",
  "Dark Paradise",
  "Fragile Devotion",
  "Reckless Heart",
  "Stolen Moments",
  "Wildfire Romance",
  "Tender Trap",
  "Breathless Encounter",
  "Sweet Surrender",
  "Midnight Confession",
  "Hidden Truth",
  "Precious Chaos",
  "Burning Bridges",
  "Shattered Illusions",
  "Passion Unbound",
  "Eternal Flame",
  "Twisted Fate",
  "Undeniable Spark",
];

const authors = [
  "Elena Sinclair",
  "Victoria Blake",
  "Jessica Summers",
  "Sophie Chen",
  "Aria Rose",
  "Mina Harker",
  "Luna Cross",
  "Scarlett Night",
  "Ivy Sterling",
  "Rose Winters",
  "Haven Winter",
  "Sage Miranda",
  "Raven Cross",
  "Phoenix Lane",
  "Storm Bailey",
  "Sienna Blake",
  "Aurora Knight",
  "Destiny Hayes",
  "Freya Anderson",
  "Jade Montgomery",
  "Kira Matthews",
  "Leila Stone",
  "Morgan Chase",
  "Nova Quinn",
  "Ophelia Ross",
  "Piper Grant",
  "Quinn Foster",
  "Riley Stone",
  "Sierra Miles",
  "Tessa Brooks",
  "Uma Patel",
  "Violet Hayes",
  "Whitney Stone",
  "Xena Pierce",
  "Yara Khan",
  "Zoe Martin",
  "Amber Cross",
  "Brooklyn Hayes",
  "Cassie Lane",
  "Dakota Stone",
];

// Generate cover image paths from assets/portrait folder
const coverImages = Array.from({ length: 53 }, (_, i) => `/assets/portrait/${i + 1}p.jpg`);

const chapterImages = [
  "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=400&fit=crop",
];

export const generateStories = (): Story[] => {
  const stories: Story[] = [];
  let storyIndex = 0;

  for (const category of categories) {
    for (let i = 0; i < category.storyCount; i++) {
      if (storyIndex >= storyTitles.length) break;

      stories.push({
        id: `story-${storyIndex + 1}`,
        categoryId: category.id,
        title: storyTitles[storyIndex],
        author: authors[storyIndex % authors.length],
        description: `A captivating tale of love, passion, and redemption. ${storyTitles[storyIndex]} follows two souls whose connection transcends all boundaries. Featuring ${Math.floor(Math.random() * 50) + 30} gripping chapters filled with tension, emotion, and unforgettable moments.`,
        coverImage: coverImages[storyIndex % coverImages.length],
        rating: Math.random() * 0.4 + 4.5,
        reviewCount: Math.floor(Math.random() * 2000) + 500,
        totalChapters: Math.floor(Math.random() * 30) + 25,
        genre: category.name,
        isTrending: storyIndex < 10,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      });

      storyIndex++;
    }
  }

  return stories.slice(0, 40);
};

export const generateChapters = (storyId: string, storyTitle: string, totalChapters: number): Chapter[] => {
  const chapters: Chapter[] = [];

  for (let i = 1; i <= totalChapters; i++) {
    chapters.push({
      id: `chapter-${storyId}-${i}`,
      storyId,
      number: i,
      title: `${storyTitle} - Part ${i}`,
      content: chapterContent(i, storyTitle),
      estimatedReadTime: Math.floor(Math.random() * 15) + 8,
      images: [
        chapterImages[Math.floor(Math.random() * chapterImages.length)],
        chapterImages[Math.floor(Math.random() * chapterImages.length)],
      ],
      isLocked: i > 1,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return chapters;
};

export const defaultUser: User = {
  id: "user-default",
  phone: "",
  isVerified: false,
  subscription: {
    plan: "none",
    expiresAt: null,
    isActive: false,
  },
  readingHistory: [],
  createdAt: new Date().toISOString(),
};

export const subscriptionPlans = [
  {
    id: "weekly",
    name: "Weekly Pass",
    price: "$2.99",
    duration: "7 days",
    features: ["Access all stories", "Ad-free reading", "Offline mode"],
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: "$9.99",
    duration: "30 days",
    features: ["Access all stories", "Ad-free reading", "Offline mode", "Early access to new stories"],
    badge: "Best Value",
  },
  {
    id: "3-month",
    name: "3-Month Premium",
    price: "$24.99",
    duration: "90 days",
    features: [
      "Access all stories",
      "Ad-free reading",
      "Offline mode",
      "Early access to new stories",
      "Exclusive author content",
    ],
  },
];
