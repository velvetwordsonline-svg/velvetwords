import { useNavigate } from "react-router-dom";
import { LogOut, Edit2, Zap, Clock, CheckCircle, Lock, User } from "lucide-react";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SubscriptionPopup from "@/components/SubscriptionPopup";
import { useApp } from "@/contexts/AppContext";

export default function Account() {
  const navigate = useNavigate();
  const { user, isLoggedIn, stories, getReadingProgress, getChaptersByStoryId, logout, updateReadingProgress, verifyPhoneNumber, selectSubscription } = useApp();
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  // Add some sample reading progress for testing if none exists
  useEffect(() => {
    if (user && user.readingHistory.length === 0 && stories.length > 0) {
      // Add sample progress for the first story
      const firstStory = stories[0];
      if (firstStory) {
        updateReadingProgress(firstStory.id, 1, 0, 25);
      }
    }
  }, [user, stories, updateReadingProgress]);

  const handleSubscriptionSuccess = (phone: string, plan: string) => {
    verifyPhoneNumber(phone);
    selectSubscription(plan as "weekly" | "monthly" | "3-month");
    setShowSubscriptionPopup(false);
  };

  // If user is not logged in, show login interface
  if (!isLoggedIn || !user) {
    return (
      <div className="bg-black min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <User className="w-24 h-24 text-gray-600 mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-white mb-4">Account Access</h1>
          <p className="text-gray-400 mb-8 text-lg">Login to access interesting stories</p>
          <button
            onClick={() => setShowSubscriptionPopup(true)}
            className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]"
          >
            Login
          </button>
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

  // Get stories with reading progress
  const continueReadingStories = user.readingHistory
    .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
    .slice(0, 8)
    .map((history) => {
      const story = stories.find((s) => s.id === history.storyId);
      return story
        ? {
            ...story,
            progress: history.progressPercentage,
            lastChapter: history.lastChapterRead,
            lastReadAt: history.lastReadAt,
          }
        : null;
    })
    .filter(Boolean);

  // Check if user has special access (phone number 8923529921)
  const hasSpecialAccess = user.phone === "8923529921";
  
  const isSubscriptionActive = hasSpecialAccess || (
    user.subscription.isActive && user.subscription.expiresAt
      ? new Date(user.subscription.expiresAt) > new Date()
      : false
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleResumeReading = (storyId: string, chapterId: string) => {
    navigate(`/reader/${storyId}/${chapterId}`);
  };

  return (
    <div className="bg-black min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Account Header */}
        <div className="mb-20">
          <div
            className={`bg-dark-gray border-[3px] rounded-lg p-10 transition-all ${
              isSubscriptionActive ? "border-primary shadow-[0_0_30px_rgba(106,13,173,0.4)]" : "border-white/20"
            }`}
          >
            <div className="flex items-start justify-between gap-8 flex-col sm:flex-row">
              {/* User Info */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  {user.phone.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
                  <p className="text-gray-400 text-lg mb-4">Mobile: {user.phone}</p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                        isSubscriptionActive
                          ? "bg-primary/20 text-primary"
                          : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      {isSubscriptionActive ? "Active" : "No Subscription"}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {hasSpecialAccess ? "Premium Access" : user.subscription.plan && `${user.subscription.plan} Plan`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button className="flex items-center gap-2 px-6 py-3 bg-primary/20 text-primary font-bold rounded-lg hover:bg-primary/30 transition-colors border border-primary/50">
                  <Edit2 className="w-4 h-4" />
                  Manage Subscription
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-destructive/20 text-destructive font-bold rounded-lg hover:bg-destructive/30 transition-colors border border-destructive/50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        {isSubscriptionActive && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-dark-gray border-[3px] border-white/20 rounded-lg p-6">
              <p className="text-gray-400 text-sm font-semibold mb-2">Plan</p>
              <p className="text-white font-bold text-2xl capitalize">
                {hasSpecialAccess ? "Premium" : user.subscription.plan}
              </p>
            </div>
            <div className="bg-dark-gray border-[3px] border-white/20 rounded-lg p-6">
              <p className="text-gray-400 text-sm font-semibold mb-2">Expires</p>
              <p className="text-white font-bold text-2xl">
                {hasSpecialAccess ? "Never" : user.subscription.expiresAt ? new Date(user.subscription.expiresAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="bg-dark-gray border-[3px] border-white/20 rounded-lg p-6">
              <p className="text-gray-400 text-sm font-semibold mb-2">Days Left</p>
              <p className="text-primary font-bold text-2xl">
                {hasSpecialAccess ? "∞" : user.subscription.expiresAt ? Math.max(
                  0,
                  Math.ceil(
                    (new Date(user.subscription.expiresAt).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                ) : 0}
              </p>
            </div>
          </div>
        )}

        {/* Continue Reading */}
        {continueReadingStories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Continue Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {continueReadingStories.map((story) => {
                const chapters = getChaptersByStoryId(story.id);
                const lastChapterId = chapters.find((c) => c.number === story.lastChapter)?.id;

                return (
                  <div
                    key={story.id}
                    className="bg-dark-gray border-[3px] border-white/20 rounded-lg overflow-hidden hover:border-primary transition-all group cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-dark-gray">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/The-Silence-We-Didnt-Break.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{story.title}</h3>
                      <p className="text-gray-400 text-xs mb-3">
                        Chapter {story.lastChapter} • {Math.round(story.progress)}% read
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${story.progress}%` }}
                        ></div>
                      </div>

                      {/* Resume Button */}
                      <button
                        onClick={() => lastChapterId && handleResumeReading(story.id, lastChapterId)}
                        className="w-full py-2 bg-primary/20 text-primary font-bold rounded hover:bg-primary/30 transition-colors text-sm"
                      >
                        Resume
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reading Activity */}
        {user.readingHistory.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Reading Activity</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {user.readingHistory
                .sort((a, b) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())
                .map((history, idx) => {
                  const story = stories.find((s) => s.id === history.storyId);
                  const chapters = getChaptersByStoryId(history.storyId);
                  const lastChapter = chapters.find((c) => c.number === history.lastChapterRead);

                  return story ? (
                    <div
                      key={idx}
                      className="bg-dark-gray border-[3px] border-white/20 rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-sm">{story.title}</h3>
                          <p className="text-gray-400 text-xs mt-1">
                            Chapter {history.lastChapterRead}: {lastChapter?.title || "Unknown"}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-primary font-bold text-sm">{Math.round(history.progressPercentage)}%</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(history.lastReadAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
            </div>
          </div>
        )}

        {user.readingHistory.length === 0 && (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No reading activity yet</p>
            <p className="text-gray-500 text-sm mt-2">Start reading a story to see your progress here</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
