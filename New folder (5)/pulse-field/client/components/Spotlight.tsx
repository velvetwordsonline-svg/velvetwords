import { useState, useEffect } from "react";
import { ChevronRight, Star } from "lucide-react";

interface SpotlightItem {
  id: string;
  image: string;
  title: string;
  description: string;
  genre: string;
  rating: number;
  reviews: number;
  chapters: number;
  isNew: boolean;
}

interface SpotlightProps {
  items: SpotlightItem[];
  autoRotateInterval?: number;
}

export default function Spotlight({
  items,
  autoRotateInterval = 5000,
}: SpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Return early if no items
  if (!items || items.length === 0) {
    return (
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">
            Best of the Week
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[3/4] rounded-lg bg-gray-800 animate-pulse max-w-md mx-auto"></div>
            <div className="space-y-6">
              <div className="h-12 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-20 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoRotateInterval);
    return () => clearInterval(interval);
  }, [items.length, autoRotateInterval]);

  const current = items[currentIndex];

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">
          Best of the Week
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Large Cover Image */}
          <div className="relative group">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-[3px] border-primary shadow-[0_0_40px_rgba(106,13,173,0.4)] max-w-md mx-auto">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

              {/* New Badge */}
              {current.isNew && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-primary text-white font-bold rounded-full text-sm animate-pulse">
                  New
                </div>
              )}
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h3 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {current.title}
              </h3>
              <p className="text-secondary text-lg font-semibold">{current.genre}</p>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-base leading-relaxed max-w-xl">
              {current.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-white/20">
              <div>
                <p className="text-primary font-bold text-2xl">{current.rating.toFixed(1)}</p>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  Rating
                </p>
              </div>
              <div>
                <p className="text-secondary font-bold text-2xl">{current.reviews}K</p>
                <p className="text-gray-400 text-sm">Reviews</p>
              </div>
              <div>
                <p className="text-primary font-bold text-2xl">{current.chapters}</p>
                <p className="text-gray-400 text-sm">Chapters</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-4 flex-wrap">
              <button className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(106,13,173,0.6)] transition-all">
                Read Now
              </button>
              <button className="px-8 py-3 border-[3px] border-secondary text-secondary font-bold rounded-lg hover:border-primary hover:text-primary transition-all">
                View Details
              </button>
            </div>

            {/* Carousel Dots */}
            <div className="flex gap-2 pt-4">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-white/30 w-2 hover:bg-white/50"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
