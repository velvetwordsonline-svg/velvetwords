import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export default function Carousel({
  children,
  title,
  className = "",
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <section className={`py-8 sm:py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12">
          {title}
        </h2>

        <div className="relative group">
          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-16 pb-4 px-2">
              {children}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            className="hidden group-hover:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 items-center justify-center w-12 h-12 bg-primary rounded-full text-white hover:bg-primary/90 transition-all shadow-lg z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 items-center justify-center w-12 h-12 bg-primary rounded-full text-white hover:bg-primary/90 transition-all shadow-lg z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
