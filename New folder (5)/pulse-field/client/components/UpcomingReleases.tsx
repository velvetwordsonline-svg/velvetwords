import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UpcomingRelease {
  id: string;
  image: string;
  title: string;
  description: string;
  releaseDate: string;
  category: string;
}

interface UpcomingReleasesProps {
  items: UpcomingRelease[];
}

export default function UpcomingReleases({ items }: UpcomingReleasesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate random future dates
  const generateRandomDate = () => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000); // Random date within next 90 days
    return futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
          Upcoming Releases
        </h2>

        {/* Carousel */}
        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-3 pb-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-64 sm:w-72 lg:w-80"
                >
                  {/* Split Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-[3px] border-white/20 rounded-lg overflow-hidden hover:border-secondary transition-colors bg-dark-gray/50 h-full">
                    {/* Image Side */}
                    <div className="aspect-[3/4] sm:aspect-auto sm:h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/The-Silence-We-Didnt-Break.png';
                        }}
                      />
                    </div>

                    {/* Text Side */}
                    <div className="p-4 flex flex-col justify-between h-full">
                      <div className="flex-1">
                        <p className="text-secondary text-xs font-bold mb-2">
                          {generateRandomDate()}
                        </p>
                        <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-xs mb-2 font-semibold">
                          {item.category}
                        </p>
                        <p className="text-gray-300 text-xs line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="hidden group-hover:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 items-center justify-center w-10 h-10 bg-primary rounded-full text-white hover:bg-primary/90 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 items-center justify-center w-10 h-10 bg-primary rounded-full text-white hover:bg-primary/90 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
