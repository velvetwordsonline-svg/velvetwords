import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StoryDetailSlider from "@/components/StoryDetailSlider";
import { getStoriesByCategory } from "@/lib/api";

const categories = ["romance", "thriller", "fantasy", "mystery", "scifi"];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);

  useEffect(() => {
    loadStories();
  }, [activeCategory, language]);

  const loadStories = async () => {
    setLoading(true);
    try {
      const data = await getStoriesByCategory(activeCategory, language);
      setStories(data);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story: any) => {
    setSelectedStory(story);
    setIsSliderOpen(true);
  };

  const handleCloseSlider = () => {
    setIsSliderOpen(false);
    setTimeout(() => setSelectedStory(null), 350);
  };

  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      
      {/* Gradient divider line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50" />
      
      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-[1300px] mx-auto">
          
          {/* Language Switcher */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setLanguage("en")}
              className={`
                px-6 py-2 rounded-full border-[1.5px] font-medium text-sm
                transition-all duration-300
                ${
                  language === "en"
                    ? "border-purple-600 bg-purple-600/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                    : "border-purple-600 bg-transparent text-white hover:bg-[#1a082f]"
                }
              `}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`
                px-6 py-2 rounded-full border-[1.5px] font-medium text-sm
                transition-all duration-300
                ${
                  language === "hi"
                    ? "border-purple-600 bg-purple-600/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                    : "border-purple-600 bg-transparent text-white hover:bg-[#1a082f]"
                }
              `}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage("hinglish")}
              className={`
                px-6 py-2 rounded-full border-[1.5px] font-medium text-sm
                transition-all duration-300
                ${
                  language === "hinglish"
                    ? "border-purple-600 bg-purple-600/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                    : "border-purple-600 bg-transparent text-white hover:bg-[#1a082f]"
                }
              `}
            >
              Hinglish
            </button>
          </div>
          
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button
              onClick={() => setActiveCategory(null)}
              className={`
                px-8 py-3 rounded-full border-[1.5px] font-medium text-sm
                transition-all duration-300 ease-in-out capitalize
                ${
                  activeCategory === null
                    ? "border-purple-600 bg-purple-600/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                    : "border-purple-600 bg-transparent text-white hover:bg-[#1a082f] hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                }
              `}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-8 py-3 rounded-full border-[1.5px] font-medium text-sm
                  transition-all duration-300 ease-in-out capitalize
                  ${
                    activeCategory === category
                      ? "border-purple-600 bg-purple-600/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                      : "border-purple-600 bg-transparent text-white hover:bg-[#1a082f] hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Story Cards Grid */}
          {!loading && stories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => handleStoryClick(story)}
                  className="
                    group relative
                    bg-[#050505] rounded-xl border-[1.5px] border-purple-600
                    cursor-pointer
                    transition-all duration-300 ease-in-out
                    hover:scale-[1.03]
                    shadow-[0_0_15px_rgba(124,58,237,0.3)]
                    hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]
                    overflow-hidden
                  "
                >
                  {/* Thumbnail */}
                  {story.coverImage && (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  
                  {/* Story Info */}
                  <div className="p-4">
                    <h3 className="text-white text-lg font-medium mb-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">by {story.author}</p>
                    <p className="text-gray-500 text-sm line-clamp-2">{story.description}</p>
                    <div className="mt-3 flex justify-between text-xs text-gray-500">
                      <span className="bg-purple-600/20 px-2 py-1 rounded">{story.category}</span>
                      <span>{story.totalChapters} chapters</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && stories.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No stories found in this category
            </div>
          )}
        </div>
      </section>
      
      {/* Story Detail Slider */}
      <StoryDetailSlider
        isOpen={isSliderOpen}
        onClose={handleCloseSlider}
        story={selectedStory}
      />
      
      <Footer />
    </div>
  );
}
