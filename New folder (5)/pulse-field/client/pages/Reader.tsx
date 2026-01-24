import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Reader from "@/components/Reader";
import SubscriptionPopup from "@/components/SubscriptionPopup";
import { useApp } from "@/contexts/AppContext";

// API Configuration
const API_BASE = "http://localhost:5001/api";

interface ChapterContent {
  id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  content: Array<{ type: string; data: string; order: number }>;
  estimatedReadTime: number;
}

interface ChapterListItem {
  id: string;
  number: number;
  title: string;
  estimatedReadTime: number;
}

export default function ReaderPage() {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId?: string }>();
  const navigate = useNavigate();
  const { canAccessChapter, verifyPhoneNumber, selectSubscription, getChaptersByStoryId, getChapterById } = useApp();
  const [currentChapter, setCurrentChapter] = useState<ChapterContent | null>(null);
  const [chapters, setChapters] = useState<ChapterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch chapters list for navigation
  useEffect(() => {
    if (!storyId) return;

    // Use AppContext chapters instead of API
    const chaptersData = getChaptersByStoryId(storyId);
    const formattedChapters = chaptersData.map((ch) => ({
      id: ch.id,
      number: ch.number,
      title: ch.title,
      estimatedReadTime: ch.estimatedReadTime
    }));
    setChapters(formattedChapters);
  }, [storyId, getChaptersByStoryId]);

  // Fetch current chapter content
  useEffect(() => {
    if (!storyId) return;
    
    setLoading(true);
    setError("");

    try {
      let chapterData;
      
      if (chapterId) {
        // Get specific chapter
        chapterData = getChapterById(storyId, chapterId);
      } else {
        // Get first chapter
        const allChapters = getChaptersByStoryId(storyId);
        chapterData = allChapters.find(ch => ch.number === 1);
      }
      
      if (!chapterData) {
        throw new Error("No chapter content available");
      }

      const chapterNum = chapterData.number;
      
      // Check if user can access this chapter
      if (chapterNum > 1 && !canAccessChapter(chapterNum)) {
        setShowAuthModal(true);
        setLoading(false);
        return;
      }

      setCurrentChapter({
        id: chapterData.id,
        storyId: chapterData.storyId,
        chapterNumber: chapterData.number,
        title: chapterData.title,
        content: [{ type: 'text', data: chapterData.content, order: 1 }],
        estimatedReadTime: chapterData.estimatedReadTime
      });
    } catch (err) {
      console.error("Failed to fetch chapter:", err);
      setError("Chapter not found. This story may not have been processed yet.");
    } finally {
      setLoading(false);
    }
  }, [storyId, chapterId, getChaptersByStoryId, getChapterById, canAccessChapter]);

  if (!storyId) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <p>Invalid story</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <p>Loading chapter...</p>
      </div>
    );
  }

  if (error || !currentChapter) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-xl mb-4">{error}</p>
          <p className="text-sm text-gray-400 mb-4">
            If this is a newly uploaded story, please wait for processing to complete.
          </p>
          <button
            onClick={() => navigate(`/story/${storyId}`)}
            className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90"
          >
            Return to Story
          </button>
        </div>
      </div>
    );
  }

  // Remove access check - allow all chapters
  // if (!canAccessChapter(currentChapter.chapterNumber)) {
  //   return (
  //     <div className="w-full h-screen flex items-center justify-center bg-black text-white flex-col gap-4">
  //       <p className="text-xl font-bold">You don't have access to this chapter</p>
  //       <button
  //         onClick={() => navigate(`/story/${storyId}`)}
  //         className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90"
  //       >
  //         Return to Story
  //       </button>
  //     </div>
  //   );
  // }



  const handleAuthSuccess = (phone: string, plan: string) => {
    verifyPhoneNumber(phone);
    selectSubscription(plan as "weekly" | "monthly" | "3-month");
    setShowAuthModal(false);
    // Reload the chapter
    window.location.reload();
  };

  return (
    <>
      <Reader
        storyId={storyId}
        chapterId={currentChapter.id}
        chapters={chapters}
        currentChapter={currentChapter}
        onNavigate={(newChapterId) => {
          const newChapter = chapters.find((c) => c.id === newChapterId);
          if (newChapter && !canAccessChapter(newChapter.number)) {
            setShowAuthModal(true);
            return;
          }
          navigate(`/reader/${storyId}/${newChapterId}`);
        }}
      />
      
      <SubscriptionPopup
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
