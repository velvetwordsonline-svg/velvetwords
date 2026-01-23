import { Heart, BookOpen, Zap } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import StoryCard from "@/components/StoryCard";
import CharacterCard from "@/components/CharacterCard";
import CategoryCard from "@/components/CategoryCard";
import Spotlight from "@/components/Spotlight";
import QuotesCarousel from "@/components/QuotesCarousel";
import UpcomingReleases from "@/components/UpcomingReleases";
import Carousel from "@/components/Carousel";
import { useApp } from "@/contexts/AppContext";
import { categories } from "@/lib/mockData";

const featuredCharacters = [
  {
    id: "1",
    image: "/assets/characters/aarohi.png",
    name: "Aarohi",
    power: "Passionate",
    description: "A fierce woman who knows what she wants and isn't afraid to take it.",
    gender: "female",
  },
  {
    id: "2",
    image: "/assets/characters/abbas.png",
    name: "Abbas",
    power: "Mysterious",
    description: "A brooding figure with secrets that unravel slowly through every chapter.",
    gender: "male",
  },
  {
    id: "3",
    image: "/assets/characters/akshath.png",
    name: "Akshath",
    power: "Dominant",
    description: "A commanding presence that demands attention and respect.",
    gender: "male",
  },
  {
    id: "4",
    image: "/assets/characters/alisha.png",
    name: "Alisha",
    power: "Seductive",
    description: "A woman whose charm is impossible to resist.",
    gender: "female",
  },
  {
    id: "5",
    image: "/assets/characters/ananya.png",
    name: "Ananya",
    power: "Intriguing",
    description: "A mysterious woman who draws everyone into her captivating world.",
    gender: "female",
  },
  {
    id: "6",
    image: "/assets/characters/Arjun.png",
    name: "Arjun",
    power: "Intense",
    description: "A man whose intensity burns through every interaction.",
    gender: "male",
  },
  {
    id: "7",
    image: "/assets/characters/kanav.png",
    name: "Kanav",
    power: "Obsessive",
    description: "A powerful man whose obsession becomes all-consuming and irresistible.",
    gender: "male",
  },
  {
    id: "8",
    image: "/assets/characters/meera.png",
    name: "Meera",
    power: "Captivating",
    description: "A captivating soul that leaves everyone wanting more.",
    gender: "female",
  },
  {
    id: "9",
    image: "/assets/characters/riya.png",
    name: "Riya",
    power: "Alluring",
    description: "An alluring woman who knows her worth.",
    gender: "female",
  },
  {
    id: "10",
    image: "/assets/characters/sana.png",
    name: "Sana",
    power: "Enchanting",
    description: "An enchanting presence that mesmerizes all.",
    gender: "female",
  },
  {
    id: "11",
    image: "/assets/characters/shankar.png",
    name: "Shankar",
    power: "Magnetic",
    description: "A magnetic personality that draws everyone in.",
    gender: "male",
  },
  {
    id: "12",
    image: "/assets/characters/sia.png",
    name: "Sia",
    power: "Powerful",
    description: "A powerful figure with an undeniable presence.",
    gender: "female",
  },
];

const quotes = [
  {
    id: "1",
    text: "In every love story, there's a moment where you stop thinking and just feel.",
    author: "Elena Sinclair",
  },
  {
    id: "2",
    text: "The most dangerous thing is when two souls recognize each other.",
    author: "Victoria Blake",
  },
  {
    id: "3",
    text: "Love is not about finding someone you can live with. It's about finding someone you can't imagine living without.",
    author: "Sophie Chen",
  },
  {
    id: "4",
    text: "Sometimes the greatest passion stories are the ones no one else understands.",
    author: "Aria Rose",
  },
];

export default function Index() {
  const { stories, loading } = useApp();
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");

  // Show loading state with faster timeout
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading stories...</p>
        </div>
      </div>
    );
  }

  const filteredCharacters = featuredCharacters.filter(
    (char) => genderFilter === "all" || char.gender === genderFilter
  );
  const displayedCharacters = showAllCharacters
    ? filteredCharacters
    : filteredCharacters.slice(0, 4);

  const trendingStories = stories.slice(0, 5).sort(() => Math.random() - 0.5);
  // Use random 5 stories for trending section (reduced for performance)
  const displayTrendingStories = trendingStories;
  const newArrivals = stories.slice(0, 8).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const spotlightItems = stories.slice(0, 3).map((story) => ({
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

  const upcomingReleases = stories.length > 10 ? stories.slice(10, 20).map((story) => ({
    id: story.id,
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
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Featured Characters
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setGenderFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  genderFilter === "all"
                    ? "bg-primary text-white"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setGenderFilter("male")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  genderFilter === "male"
                    ? "bg-primary text-white"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setGenderFilter("female")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  genderFilter === "female"
                    ? "bg-primary text-white"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                Female
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                {...character}
                onCardClick={() => console.log("Character:", character.name)}
              />
            ))}
          </div>
          {filteredCharacters.length > 4 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAllCharacters(!showAllCharacters)}
                className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {showAllCharacters ? "Show Less" : "View More"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                image={category.image}
                name={category.name}
                icon={category.icon}
                count={category.storyCount}
                onCardClick={() => console.log("Category:", category.name)}
              />
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
      <QuotesCarousel quotes={quotes} rotationInterval={4000} />

      {/* Upcoming Releases */}
      <UpcomingReleases items={upcomingReleases} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
