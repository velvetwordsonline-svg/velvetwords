import { createContext, useContext, useState, ReactNode } from "react";
import { User, Story, Chapter, generateStories, generateChapters } from "@/lib/mockData";

interface AdminContextType {
  user: User | null;
  stories: Story[];
  getStoryById: (id: string) => Story | undefined;
  getChaptersByStoryId: (storyId: string) => Chapter[];
  updateStories: (stories: Story[]) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const chapters: { [key: string]: Chapter[] } = {};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("velvetWords_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
    return null;
  });
  
  const [stories, setStories] = useState(() => {
    const generated = generateStories();
    // Initialize chapters
    generated.forEach((story) => {
      chapters[story.id] = generateChapters(story.id, story.title, story.totalChapters);
    });
    return generated;
  });

  const getStoryById = (id: string): Story | undefined => {
    return stories.find((s) => s.id === id);
  };

  const getChaptersByStoryId = (storyId: string): Chapter[] => {
    return chapters[storyId] || [];
  };

  const updateStories = (updatedStories: Story[]) => {
    setStories(updatedStories);
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        stories,
        getStoryById,
        getChaptersByStoryId,
        updateStories,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}

