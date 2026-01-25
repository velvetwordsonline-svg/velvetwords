import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Story, Chapter, ReadingProgress } from "@/lib/mockData";
import { defaultUser } from "@/lib/mockData";

// API Configuration
const API_BASE = "http://localhost:5001/api";

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  stories: Story[];
  getStoryById: (id: string) => Promise<Story | undefined>;
  getChaptersByStoryId: (storyId: string) => Chapter[];
  getChapterById: (storyId: string, chapterId: string) => Chapter | undefined;
  verifyPhoneNumber: (phone: string) => void;
  selectSubscription: (plan: "weekly" | "monthly" | "3-month") => void;
  logout: () => void;
  updateReadingProgress: (storyId: string, chapterNumber: number, position: number, percentage: number) => void;
  getReadingProgress: (storyId: string) => ReadingProgress | undefined;
  canAccessChapter: (chapterNumber: number) => boolean;
  refreshStories: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([
    {
      id: "1",
      categoryId: "everyday-chemistry",
      title: "Between Staying and Leaving",
      author: "Unknown Author",
      description: "Two ambitious professionals defy distance and deadlines, choosing connection over logic, merging hearts across continents and corporate hierarchies.",
      coverImage: "/assets/Between-Staying-and-Leaving.png",
      rating: 4.8,
      reviewCount: 156,
      totalChapters: 3,
      genre: "Everyday chemistry",
      isTrending: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      categoryId: "slow-emotional",
      title: "The Silence We Didn't Break",
      author: "Unknown Author",
      description: "Two men, parallel yet close, navigate unspoken desire in a high-tech world, finding connection through silence, code, and subtle intimacy.",
      coverImage: "/assets/The-Silence-We-Didnt-Break.png",
      rating: 4.5,
      reviewCount: 89,
      totalChapters: 3,
      genre: "Slow & emotional",
      isTrending: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      categoryId: "travel-temporary",
      title: "Two Nights Before Goodbye",
      author: "Unknown Author",
      description: "A fleeting, intense romance blooms between a wandering travel blogger and a disciplined army officer, showing how brief encounters can leave permanent imprints on the heart.",
      coverImage: "/assets/Two-Nights-Before-Goodbye.png",
      rating: 4.7,
      reviewCount: 124,
      totalChapters: 3,
      genre: "Travel & Temporary love",
      isTrending: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "4",
      categoryId: "forbidden-risky",
      title: "When Desire Learned Patience",
      author: "Unknown Author",
      description: "A widowed professor and his brilliant young student navigate desire, patience, and societal judgment to find love across time and distance.",
      coverImage: "/assets/When-Desire-Learned-Patience.png",
      rating: 4.6,
      reviewCount: 98,
      totalChapters: 5,
      genre: "Age Gap Romance",
      isTrending: false,
      createdAt: new Date().toISOString()
    }
  ]);
  const [chapters, setChapters] = useState<{ [key: string]: Chapter[] }>({
    "1": [
      {
        id: "ch1",
        storyId: "1",
        number: 1,
        title: "The Architecture of a Deal",
        content: `The boardroom on the 42nd floor of the Cyber City tower was a masterpiece of glass and intimidation. Outside, the Gurgaon skyline was a hazy mosaic of steel and dust, but inside, the air was filtered, chilled to a crisp 19°C, and smelled faintly of expensive floor wax and pressurized ambition.

Siddharth adjusted his cufflinks—silver, minimalist, sharp. He didn't look like a man who had been awake for forty-eight hours, though the faint tension in his jaw betrayed him. Across the table sat the acquisition team for the textile conglomerate, and at their center was Ishita.

Siddharth had spent a decade dismantling companies and rebuilding them in his image. He was used to being the most formidable person in any room. He was used to people flinching when he tapped his fountain pen against a legal pad. But Ishita didn't flinch. She was currently dissecting Clause 14.2 of the merger agreement with the precision of a diamond cutter.

"The employee retention program is non-negotiable, Siddharth," she said. Her voice wasn't loud, but it possessed a resonant clarity that cut through the low hum of the server room nearby. "You're looking at these people as liabilities on a balance sheet. I'm looking at them as the intellectual capital that actually makes this company worth the $400 million you're paying for it."

Siddharth leaned back, his leather chair creaking softly. He allowed a ghost of a smile to touch his lips—a predatory expression that usually signaled the end of a negotiation. "Intellectual capital is a poetic term for a variable cost, Ishita. My client is buying infrastructure and market share. We aren't buying a social club."

"If you gut the middle management in the first quarter, you lose the culture," Ishita countered, leaning forward. She wore a sharp, tailored blazer in a shade of deep emerald that made her look like a splash of life in a room designed for sterility. "And without the culture, the infrastructure is just a collection of empty warehouses. You know I'm right. That's why you're stalling."

The room went silent. The junior associates on both sides of the table suddenly found their tablets very interesting. No one talked to Siddharth like that.

Siddharth didn't look away. He found himself cataloging the details he shouldn't be noticing: the way she tucked a stray strand of dark hair behind her ear, the slight smudge of ink on her thumb, the way her eyes—sharp and observant—refused to yield. For three weeks, this had been their ritual. They were the two suns in this corporate solar system, and everything else was just orbiting their friction.

"Let's take fifteen," Siddharth said abruptly, standing up.

The room cleared in record time. When the heavy oak doors clicked shut, only the two of them remained. The silence was heavy, charged with the kind of energy that precedes a lightning strike.

"You're being difficult for the sake of it," Siddharth said, walking toward the floor-to-ceiling window. "Is this a PR play? Are you trying to prove you're the 'People's Champion' before the London office takes you away?"

Ishita stood up, walking toward the credenza to pour herself a glass of water. Her movements were fluid, graceful, and entirely unimpressed by his stature. "I don't perform for an audience, Siddharth. And I'm not 'difficult.' I'm thorough. Something you usually appreciate in your colleagues, or so I've heard."

She walked over to the window, standing a few feet away from him. From this height, the cars below looked like frantic insects.

"London is a big move," he said, his tone shifting. The "Closer" was gone, replaced by something more human, though no less intense.

"It's a promotion," she replied. "The kind you don't turn down. Head of Global Strategy."

"It's a long way from Gurgaon."

"Is that a legal observation or a personal one?" Ishita turned her head to look at him.

Siddharth felt the air in his lungs grow heavy. He was a man of logic, of structures and precedents. But there was no precedent for the way his pulse spiked when she challenged him. He reached out, his hand hovering near the glass, close enough to feel the warmth radiating from her arm.

"Personal," he admitted, the word sounding foreign in his own mouth. "The firm won't be the same without someone to keep me in check."

"You'll find someone else to fight with within a week," she whispered, though she didn't move away.

"I don't want someone else," he said. The admission was a breach of contract, a violation of every professional boundary he had spent fifteen years building. He turned to face her fully. "Ishita, the deal closes tomorrow. The papers are finalized. There is no more 'us' in a professional capacity after 5 PM."

"I know," she said, her voice dropping to a breathy silver of sound.

He took a step closer. The gap between them was barely an inch—the space between staying and leaving. He could see the slight tremor in her hands. He could hear the rhythm of her breathing, mirroring his own. For a moment, the $400 million deal, the London promotion, and the corporate hierarchy vanished. There was only the heat of her presence and the terrifying realization that he was about to lose the only person who truly saw him.

"Stay for dinner," he said. It wasn't a command. It was a plea.

Ishita looked at him, her eyes searching his for a sign of the mask. She found none. "Siddharth... the flight is at 6 AM."

"I know," he repeated. "Stay anyway."`,
        estimatedReadTime: 8,
        images: [],
        isLocked: false,
        createdAt: new Date().toISOString()
      }
    ]
  });
  const [loading, setLoading] = useState(false);

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

  const refreshStories = () => {
    // No-op for mock data
  };

  const getStoryById = async (id: string): Promise<Story | undefined> => {
    return stories.find(story => story.id === id);
  };

  const getChaptersByStoryId = (storyId: string): Chapter[] => {
    return chapters[storyId] || [];
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
        refreshStories,
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