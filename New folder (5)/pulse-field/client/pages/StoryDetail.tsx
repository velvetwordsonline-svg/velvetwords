import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, Lock, Play, Bookmark } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SubscriptionPopup from "@/components/SubscriptionPopup";
import { useApp } from "@/contexts/AppContext";

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStoryById, getChaptersByStoryId, canAccessChapter, verifyPhoneNumber, selectSubscription } = useApp();
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch story data
  useEffect(() => {
    if (!id) return;
    
    const fetchStory = async () => {
      setLoading(true);
      try {
        const storyData = await getStoryById(id);
        setStory(storyData);
      } catch (error) {
        console.error('Failed to fetch story:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStory();
  }, [id, getStoryById]);

  const chapters = id ? getChaptersByStoryId(id) : [];

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading story...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="bg-black min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Story Not Found</h1>
          <p className="text-gray-400 mb-8">The story you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
          >
            Return Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChapterClick = (chapterNumber: number, chapterId: string) => {
    if (chapterNumber > 1 && !canAccessChapter(chapterNumber)) {
      setShowSubscriptionPopup(true);
      return;
    }

    if (chapterNumber === 1) {
      navigate(`/reader/${id}`);
    } else {
      navigate(`/reader/${id}/${chapterId}`);
    }
  };

  const handleSubscriptionSuccess = (phone: string, plan: string) => {
    verifyPhoneNumber(phone);
    selectSubscription(plan as "weekly" | "monthly" | "3-month");
    setShowSubscriptionPopup(false);
    // Reload page to refresh access
    window.location.reload();
  };

  return (
    <div className="bg-black min-h-screen">
      <Navigation />

      {/* Hero Banner */}
      <div className="relative h-85 pt-22 ">
        <img
          src={story.coverImage}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-1">
          <div className="max-w-2xl">
            <p className="text-secondary font-bold text-sm mb-1 uppercase">{story.genre}</p>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2">{story.title}</h1>
            <p className="text-gray-300 text-lg mb-2">{story.description}</p>

            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(story.rating)
                          ? "fill-primary text-primary"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white font-bold">{story.rating.toFixed(1)}</span>
                <span className="text-gray-400">({story.reviewCount} reviews)</span>
              </div>

              <div>
                <span className="text-white font-bold">{story.totalChapters}</span>
                <span className="text-gray-400 ml-2">Chapters</span>
              </div>

              <div>
                <span className="text-white font-bold">By {story.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Chapters List */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-8">Chapters</h2>
            <div className="space-y-3">
              {chapters.map((chapter) => {
                const isLocked = chapter.number > 1 && !canAccessChapter(chapter.number);

                return (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterClick(chapter.number, chapter.id)}
                    className="w-full group relative p-4 border-[3px] border-white/20 rounded-lg hover:border-primary transition-all bg-dark-gray/50 hover:bg-dark-gray/80 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          {isLocked ? (
                            <Lock className="w-6 h-6 text-primary" />
                          ) : (
                            <Play className="w-6 h-6 text-primary" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-white font-bold group-hover:text-primary transition-colors">
                            Chapter {chapter.number}: {chapter.title}
                          </h3>
                          <div className="flex gap-4 mt-1 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {chapter.estimatedReadTime} min
                            </span>
                            {chapter.number === 1 && (
                              <span className="text-secondary font-semibold">Free</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isLocked && (
                        <div className="flex-shrink-0 px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Stats Card */}
              <div className="bg-dark-gray border-[3px] border-white/20 rounded-lg p-6">
                <h3 className="text-white font-bold text-lg mb-4">Story Info</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Total Chapters</p>
                    <p className="text-white font-bold text-xl">{story.totalChapters}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-gray-400 mb-1">Genre</p>
                    <p className="text-primary font-bold">{story.genre}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-gray-400 mb-1">Created</p>
                    <p className="text-white">{new Date(story.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                <Bookmark className="w-5 h-5" />
                Add to Library
              </button>

              {/* Author Info */}
              <div className="bg-dark-gray border-[3px] border-white/20 rounded-lg p-6">
                <h3 className="text-white font-bold mb-2">About Author</h3>
                <p className="text-gray-300 text-sm">{story.author}</p>
                <p className="text-gray-400 text-xs mt-3">
                  Crafting stories that touch the heart and stir the soul.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubscriptionPopup
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
        onSuccess={handleSubscriptionSuccess}
      />

      <Footer />
    </div>
  );
}
