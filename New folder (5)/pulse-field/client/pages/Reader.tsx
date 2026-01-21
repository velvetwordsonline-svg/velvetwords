import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Reader from "@/components/Reader";
import AuthModal from "@/components/AuthModal";
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

export default function ReaderPage() {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId?: string }>();
  const navigate = useNavigate();
  const { getChaptersByStoryId, canAccessChapter, verifyPhoneNumber, selectSubscription } = useApp();
  const [currentChapter, setCurrentChapter] = useState<ChapterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!storyId) return;

    const fetchChapter = async () => {
      setLoading(true);
      setError("");

      try {
        let url;
        if (chapterId) {
          // Fetch specific chapter
          url = `${API_BASE}/stories/${storyId}/chapters/${chapterId}`;
        } else {
          // Fetch first chapter
          url = `${API_BASE}/stories/${storyId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Chapter not found");
        }

        const data = await response.json();
        
        // Handle both single story response (with firstChapter) and direct chapter response
        const chapterData = data.firstChapter || data;
        
        if (!chapterData) {
          throw new Error("No chapter content available");
        }

        const chapterNum = chapterData.chapterNumber;
        
        // Check if user can access this chapter
        if (!canAccessChapter(chapterNum)) {
          setShowAuthModal(true);
          return;
        }

        setCurrentChapter({
          id: chapterData.id,
          storyId: chapterData.storyId || storyId,
          chapterNumber: chapterData.chapterNumber,
          title: chapterData.title,
          content: chapterData.content || [],
          estimatedReadTime: chapterData.estimatedReadTime || 5
        });
      } catch (err) {
        console.error("Failed to fetch chapter:", err);
        setError("Chapter not found");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [storyId, chapterId]);

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

  const chapters = getChaptersByStoryId(storyId);

  const handleAuthSuccess = () => {
    // Create user with phone and subscription
    verifyPhoneNumber("1234567890"); // This would come from the modal
    selectSubscription("monthly"); // This would come from the modal
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
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
