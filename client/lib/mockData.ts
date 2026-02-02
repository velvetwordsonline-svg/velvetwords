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
