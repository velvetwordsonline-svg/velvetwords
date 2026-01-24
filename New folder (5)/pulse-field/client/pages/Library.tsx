import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useApp } from "@/contexts/AppContext";

type FilterType = "all" | "reading" | "completed" | "new";

export default function Library() {
  const navigate = useNavigate();
  const { user, isLoggedIn, stories } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  if (!isLoggedIn || !user) {
    return (
      <div className="bg-black min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-8">Please log in to view your library.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Build library with progress info
  const libraryStories = stories
    .map((story) => {
      const readingProgress = user.readingHistory.find((rp) => rp.storyId === story.id);
      const progress = readingProgress?.progressPercentage || 0;
      const lastChapter = readingProgress?.lastChapterRead || 0;

      return {
        ...story,
        progress,
        lastChapter,
        status:
          progress === 0
            ? "new"
            : progress >= 100
              ? "completed"
              : "reading",
        inLibrary: readingProgress !== undefined,
      };
    })
    .filter((story) => story.inLibrary);

  // Apply filters
  const filteredStories = libraryStories.filter((story) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "reading") return story.status === "reading";
    if (activeFilter === "completed") return story.status === "completed";
    if (activeFilter === "new") return story.status === "new";
    return true;
  });

  const filters: Array<{ id: FilterType; label: string; count: number }> = [
    { id: "all", label: "All Stories", count: libraryStories.length },
    { id: "reading", label: "Continue Reading", count: libraryStories.filter((s) => s.status === "reading").length },
    { id: "completed", label: "Completed", count: libraryStories.filter((s) => s.status === "completed").length },
    { id: "new", label: "New", count: libraryStories.filter((s) => s.status === "new").length },
  ];

  return (
    <div className="bg-black min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">My Library</h1>
          <p className="text-gray-400 text-lg">
            Your personal collection of saved stories and reading progress
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-12 flex gap-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all border-[3px] ${
                activeFilter === filter.id
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-gray-400 border-white/20 hover:border-primary/50"
              }`}
            >
              {filter.label}
              <span className="ml-2 opacity-70">({filter.count})</span>
            </button>
          ))}
        </div>

        {/* Library Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => navigate(`/story/${story.id}`)}
                className="group relative w-full cursor-pointer"
              >
                {/* Card Container */}
                <div className="relative rounded-lg overflow-hidden bg-dark-gray border-[3px] border-white/20 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_rgba(106,13,173,0.4)]">
                  {/* Image */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-dark-gray">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {story.status === "completed" && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/90 text-white text-xs font-bold rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                      {story.status === "reading" && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-primary/90 text-white text-xs font-bold rounded-full">
                          <Clock className="w-3 h-3" />
                          Reading
                        </span>
                      )}
                      {story.status === "new" && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-secondary/90 text-white text-xs font-bold rounded-full">
                          <Zap className="w-3 h-3" />
                          New
                        </span>
                      )}
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                        {story.genre}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {story.status !== "new" && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${Math.min(story.progress, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{story.title}</h3>
                    <p className="text-gray-400 text-xs mb-3">{story.author}</p>

                    {/* Progress Info */}
                    {story.status !== "new" && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          {story.status === "reading"
                            ? `Chapter ${story.lastChapter}`
                            : "All Chapters"}
                        </span>
                        <span className="text-primary font-bold">{Math.round(story.progress)}%</span>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/10">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-white font-bold text-sm">{story.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-xs">({story.reviewCount} reviews)</span>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                      View Story
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Stories Yet</h3>
            <p className="text-gray-400 mb-8">
              {activeFilter === "all"
                ? "Your library is empty. Start reading a story to build your collection!"
                : `No ${activeFilter} stories in your library yet.`}
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
            >
              Explore Stories
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
