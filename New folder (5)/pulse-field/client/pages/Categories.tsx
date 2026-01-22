import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StoryDetailSlider from "@/components/StoryDetailSlider";
import { getStoriesByCategory } from "@/lib/api";

const categories = [
  { id: "everyday-chemistry", name: "Everyday Chemistry", count: 2 },
  { id: "slow-emotional", name: "Slow & Emotional", count: 4 },
  { id: "city-travel", name: "City Travel & Temporary Love", count: 2 },
  { id: "forbidden-risky", name: "Forbidden & Risky Desire", count: 7 },
  { id: "midnight-confession", name: "Midnight & Confession", count: 1 },
  { id: "power-elite", name: "Power Identity & Elite Lives", count: 1 }
];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    loadStories();
  }, [activeCategory, language]);

  // Listen for localStorage changes (when new stories are uploaded)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'stories') {
        console.log('Stories updated, reloading...');
        loadStories();
      }
    };
    
    // Listen for storage events from other tabs/components
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom storage events from same tab
    const handleCustomStorage = () => {
      console.log('Custom storage event detected, reloading stories');
      loadStories();
    };
    
    window.addEventListener('storageUpdate', handleCustomStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storageUpdate', handleCustomStorage);
    };
  }, [activeCategory, language]);

  const loadStories = async () => {
    setLoading(true);
    try {
      console.log('Loading stories for category:', activeCategory);
      const data = await getStoriesByCategory(activeCategory, language);
      console.log('Loaded stories:', data);
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
          
          {/* Category Filter Dropdown */}
          <div className="flex justify-center mb-16 gap-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="
                  px-8 py-3 rounded-full border-[1.5px] font-medium text-sm
                  transition-all duration-300 ease-in-out
                  border-purple-600 bg-purple-600/20 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]
                  flex items-center gap-2
                "
              >
                {activeCategory ? categories.find(c => c.id === activeCategory)?.name : "All Categories"}
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-80 bg-[#050505] border border-purple-600 rounded-xl shadow-[0_0_30px_rgba(124,58,237,0.6)] z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-600/20 text-white transition-colors"
                    >
                      <div className="font-medium">All Categories</div>
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-purple-600/20 text-white transition-colors"
                      >
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-400">{category.count} Stories</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={loadStories}
              className="px-4 py-3 rounded-full border border-purple-600 text-purple-400 hover:bg-purple-600/20 transition-colors"
              title="Refresh Stories"
            >
              🔄
            </button>
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
                  <div className="w-full h-64 bg-gray-800 overflow-hidden">
                    <img
                      src={story.coverImage || '/assets/portrait/1p.jpg'}
                      alt={story.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', story.coverImage);
                        e.currentTarget.src = '/assets/portrait/1p.jpg';
                      }}
                    />
                  </div>
                  
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
