import { Heart, BookOpen, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import StoryCard from "@/components/StoryCard";
import FeaturedCharacters from "@/components/FeaturedCharacters";
import CategoryCard from "@/components/CategoryCard";
import Spotlight from "@/components/Spotlight";
import QuotesCarousel from "@/components/QuotesCarousel";
import UpcomingReleases from "@/components/UpcomingReleases";
import Carousel from "@/components/Carousel";
import { useApp } from "@/contexts/AppContext";
import { getTrendingStories, getCategories } from "@/lib/api";

const featuredCharacters: any[] = [];

const mockCharacters = [
  { id: 1, name: "Aarohi", image: "/character/aarohi.png" },
  { id: 2, name: "Abbas", image: "/character/abbas.png" },
  { id: 3, name: "Akshath", image: "/character/akshath.png" },
  { id: 4, name: "Alisha", image: "/character/alisha.png" },
  { id: 5, name: "Ananya", image: "/character/ananya.png" },
  { id: 6, name: "Arjun", image: "/character/Arjun.png" },
  { id: 7, name: "Kanav", image: "/character/kanav.png" },
  { id: 8, name: "Meera", image: "/character/meera.png" },
  { id: 9, name: "Riya", image: "/character/riya.png" },
  { id: 10, name: "Sana", image: "/character/sana.png" },
  { id: 11, name: "Shankar", image: "/character/shankar.png" },
  { id: 12, name: "Sia", image: "/character/sia.png" }
];

const mockCategories = [
  { id: "everyday-chemistry", name: "Everyday chemistry", count: 1 },
  { id: "slow-emotional", name: "Slow & emotional", count: 1 },
  { id: "travel-temporary", name: "Travel & Temporary love", count: 1 },
  { id: "age-gap-romance", name: "Age Gap Romance", count: 1 }
];

const quotes: any[] = [];

export default function Index() {
  const { stories, loading } = useApp();
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [trendingStories, setTrendingStories] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch trending stories and categories
  useEffect(() => {
    const fetchData = async () => {
      setTrendingLoading(true);
      try {
        const [trending, categoriesData] = await Promise.all([
          getTrendingStories(),
          getCategories()
        ]);
        setTrendingStories(trending);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setTrendingLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Show content immediately, no loading screen
  // if (loading && stories.length === 0) {
  //   return (
  //     <div className="bg-black min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
  //         <p className="text-white text-sm">Loading stories...</p>
  //       </div>
  //     </div>
  //   );
  // }

  const filteredCharacters = featuredCharacters.filter(
    (char) => genderFilter === "all" || char.gender === genderFilter
  );
  const displayedCharacters = showAllCharacters
    ? filteredCharacters
    : filteredCharacters.slice(0, 4);

  // Use trending stories from API, fallback to local stories
  const displayTrendingStories = trendingStories.length > 0 ? trendingStories.slice(0, 5) : stories.slice(0, 5);
  
  // Duplicate stories to fill sections if we have fewer stories
  const allAvailableStories = stories.length > 0 ? [...stories, ...stories, ...stories].slice(0, 20) : [];
  
  const newArrivals = allAvailableStories.slice(0, 8).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const spotlightItems = allAvailableStories.slice(0, 3).map((story) => ({
    id: story.id,
    image: story.coverImage,
    title: story.title,
    description: story.description,
    genre: story.genre,
    rating: story.rating,
    reviews: Math.floor(story.reviewCount / 100),
    chapters: story.totalChapters,
    isNew: Math.random() > 0.7,
  }));

  const upcomingReleases = allAvailableStories.length > 0 ? allAvailableStories.slice(0, 10).map((story, index) => ({
    id: story.id + '-upcoming-' + index,
    image: story.coverImage,
    title: story.title,
    category: story.genre,
    releaseDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    description: story.description.split(".")[0] + ".",
  })) : [];

  return (
    <div className="bg-black">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Trending Stories */}
      <section className="py-0">
        <Carousel
          title="Trending Stories"
          className="bg-gradient-to-b from-transparent via-primary/10 to-transparent"
        >
          {displayTrendingStories.map((story) => (
            <div key={story.id} className="flex-shrink-0 w-36 sm:w-40 lg:w-48">
              <StoryCard
                id={story.id}
                image={story.coverImage}
                title={story.title}
                author={story.author}
                genre={story.genre}
                rating={story.rating}
                isTrending={story.isTrending}
              />
            </div>
          ))}
        </Carousel>
      </section>

      {/* Featured Characters */}
      <FeaturedCharacters />

      {/* Categories */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {mockCategories.map((category) => (
              <div key={category.id} className="bg-[#050505] border border-purple-600/50 rounded-lg p-4 hover:border-purple-600 transition-colors cursor-pointer">
                <h3 className="text-white font-medium mb-2">{category.name}</h3>
                <p className="text-gray-400 text-sm">{category.count} Stories</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-0">
        <Carousel
          title="New Arrivals"
          className="bg-gradient-to-b from-transparent via-secondary/10 to-transparent"
        >
          {newArrivals.map((story) => (
            <div key={story.id} className="flex-shrink-0 w-36 sm:w-40 lg:w-48">
              <StoryCard
                id={story.id}
                image={story.coverImage}
                title={story.title}
                author={story.author}
                genre={story.genre}
                rating={story.rating}
                isTrending={false}
                // isNew={true}
                // hideRating={true}
              />
            </div>
          ))}
        </Carousel>
      </section>

      {/* Spotlight Content */}
      <Spotlight items={spotlightItems} autoRotateInterval={5000} />

      {/* Quotes Carousel */}
      {quotes.length > 0 && <QuotesCarousel quotes={quotes} rotationInterval={4000} />}

      {/* Upcoming Releases */}
      <UpcomingReleases items={upcomingReleases} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
