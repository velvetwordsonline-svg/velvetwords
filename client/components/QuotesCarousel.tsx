import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface Quote {
  id: string;
  text: string;
  author: string;
}

interface QuotesCarouselProps {
  quotes: Quote[];
  rotationInterval?: number;
}

export default function QuotesCarousel({
  quotes,
  rotationInterval = 4000,
}: QuotesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, rotationInterval);
    return () => clearInterval(interval);
  }, [quotes.length, rotationInterval]);

  const current = quotes[currentIndex];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Speech Bubble Style Container */}
          <div className="relative bg-yellow-400/10 border-[3px] border-yellow-400/40 rounded-3xl px-8 sm:px-12 py-8 sm:py-12 before:content-[''] before:absolute before:-bottom-4 before:left-8 before:w-0 before:h-0 before:border-l-8 before:border-r-8 before:border-t-8 before:border-l-transparent before:border-r-transparent before:border-t-yellow-400/40">
            {/* Content */}
            <div className="text-center">
              <Heart className="w-6 h-6 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-xl sm:text-2xl font-serif text-gray-200 mb-4 leading-relaxed italic">
                "{current.text}"
              </p>
              <p className="text-sm text-gray-400 font-medium">— {current.author}</p>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-yellow-400 w-8"
                    : "bg-white/30 w-2 hover:bg-white/50"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
