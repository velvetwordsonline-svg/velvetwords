import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Story, Chapter, ReadingProgress } from "@/lib/mockData";
import { defaultUser } from "@/lib/mockData";

// API Configuration
const API_BASE = "http://localhost:5001/api";

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  stories: Story[];
  getStoryById: (id: string) => Story | undefined;
  getChaptersByStoryId: (storyId: string) => Chapter[];
  getChapterById: (storyId: string, chapterId: string) => Chapter | undefined;
  verifyPhoneNumber: (phone: string) => void;
  selectSubscription: (plan: "weekly" | "monthly" | "3-month") => void;
  logout: () => void;
  updateReadingProgress: (storyId: string, chapterNumber: number, position: number, percentage: number) => void;
  getReadingProgress: (storyId: string) => ReadingProgress | undefined;
  canAccessChapter: (chapterNumber: number) => boolean;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [chapters, setChapters] = useState<{ [key: string]: Chapter[] }>({});
  const [loading, setLoading] = useState(true);

  // Fetch stories from localStorage first, then backend as fallback
  useEffect(() => {
    const fetchStories = async () => {
      try {
        // First try localStorage
        const localStories = JSON.parse(localStorage.getItem('stories') || '[]');
        
        if (localStories.length > 0) {
          const formattedStories: Story[] = localStories.map((story: any, index: number) => ({
            id: story.id,
            categoryId: story.category || "cat-1",
            title: story.title,
            author: story.author,
            description: story.description,
            coverImage: story.coverImage || "/assets/portrait/1p.jpg",
            rating: story.rating || 4.5,
            reviewCount: story.reviewCount || 100,
            totalChapters: story.totalChapters || 1,
            genre: story.category || "Romance",
            isTrending: index < 3,
            createdAt: story.createdAt || new Date().toISOString()
          }));
          setStories(formattedStories);
          setLoading(false);
          return;
        }
        
        // Fallback to backend if no local stories
        const response = await fetch(`${API_BASE}/stories`);
        if (response.ok) {
          const data = await response.json();
          const formattedStories: Story[] = data.map((story: any, index: number) => ({
            id: story.id,
            categoryId: story.category || "cat-1",
            title: story.title,
            author: story.author,
            description: story.description,
            coverImage: story.thumbnail ? `http://localhost:5001${story.thumbnail}` : "/assets/portrait/1p.jpg",
            rating: story.rating || 4.5,
            reviewCount: story.reviewCount || 100,
            totalChapters: story.totalChapters,
            genre: story.category || "Romance",
            isTrending: index < 3,
            createdAt: story.createdAt
          }));
          setStories(formattedStories);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
    
    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'stories') {
        console.log('Stories updated in AppContext, reloading...');
        fetchStories();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("velvetWords_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
  }, []);

  const saveUserToStorage = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("velvetWords_user", JSON.stringify(updatedUser));
  };

  const verifyPhoneNumber = (phone: string) => {
    const newUser: User = {
      ...defaultUser,
      phone,
      isVerified: true,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveUserToStorage(newUser);
  };

  const selectSubscription = (plan: "weekly" | "monthly" | "3-month") => {
    if (!user) return;

    const daysToAdd = plan === "weekly" ? 7 : plan === "monthly" ? 30 : 90;
    const expiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

    const updatedUser: User = {
      ...user,
      subscription: {
        plan,
        expiresAt,
        isActive: true,
      },
    };

    saveUserToStorage(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("velvetWords_user");
    setUser(null);
  };

  const updateReadingProgress = (
    storyId: string,
    chapterNumber: number,
    position: number,
    percentage: number
  ) => {
    if (!user) return;

    const existingProgress = user.readingHistory.find((rp) => rp.storyId === storyId);
    const newProgress: ReadingProgress = {
      storyId,
      lastChapterRead: chapterNumber,
      lastReadPosition: position,
      progressPercentage: percentage,
      lastReadAt: new Date().toISOString(),
    };

    const updatedHistory = existingProgress
      ? user.readingHistory.map((rp) => (rp.storyId === storyId ? newProgress : rp))
      : [...user.readingHistory, newProgress];

    const updatedUser: User = {
      ...user,
      readingHistory: updatedHistory,
    };

    saveUserToStorage(updatedUser);
  };

  const getReadingProgress = (storyId: string): ReadingProgress | undefined => {
    return user?.readingHistory.find((rp) => rp.storyId === storyId);
  };

  const canAccessChapter = (chapterNumber: number): boolean => {
    // Chapter 1 is always free
    if (chapterNumber === 1) return true;
    
    // Special access for specific phone number
    if (user && user.phone === "8923529921") return true;
    
    // For chapters 2+, check if user is logged in and has active subscription
    if (!user || !user.isVerified) return false;
    
    if (!user.subscription.isActive) return false;

    if (user.subscription.expiresAt) {
      const expiresAt = new Date(user.subscription.expiresAt);
      return expiresAt > new Date();
    }

    return false;
  };

  const getStoryById = (id: string): Story | undefined => {
    return stories.find((s) => s.id === id);
  };

  const getChaptersByStoryId = (storyId: string): Chapter[] => {
    // If chapters not loaded for this story, fetch them
    if (!chapters[storyId]) {
      fetchChaptersForStory(storyId);
      return [];
    }
    return chapters[storyId] || [];
  };

  // Fetch chapters for a specific story
  const fetchChaptersForStory = async (storyId: string) => {
    try {
      const response = await fetch(`${API_BASE}/stories/${storyId}/chapters`);
      if (response.ok) {
        const data = await response.json();
        const formattedChapters: Chapter[] = data.map((chapter: any) => ({
          id: chapter.id,
          storyId: chapter.storyId || storyId,
          number: chapter.chapterNumber,
          title: chapter.title,
          content: "", // Content will be loaded separately
          estimatedReadTime: chapter.estimatedReadTime || 5,
          images: [],
          isLocked: false, // Remove chapter locking
          createdAt: chapter.createdAt || new Date().toISOString()
        }));
        
        setChapters(prev => ({
          ...prev,
          [storyId]: formattedChapters
        }));
      }
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
    }
  };

  const getChapterById = (storyId: string, chapterId: string): Chapter | undefined => {
    return chapters[storyId]?.find((c) => c.id === chapterId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: user !== null && user.isVerified,
        stories,
        getStoryById,
        getChaptersByStoryId,
        getChapterById,
        verifyPhoneNumber,
        selectSubscription,
        logout,
        updateReadingProgress,
        getReadingProgress,
        canAccessChapter,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
