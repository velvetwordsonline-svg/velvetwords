import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Zap } from "lucide-react";

interface StoryCardProps {
  id: string;
  image: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  isTrending?: boolean;
  onCardClick?: () => void;
}

export default function StoryCard({
  id,
  image,
  title,
  author,
  genre,
  rating,
  isTrending = false,
  onCardClick,
}: StoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (onCardClick) {
      onCardClick();
    } else {
      navigate(`/story/${id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 w-[200px] cursor-pointer"
    >
      {/* Card Container */}
      <div
        className={`relative rounded-lg overflow-hidden bg-dark-gray border-[3px] transition-all duration-300 ${
          isHovered
            ? "border-primary shadow-[0_0_30px_rgba(106,13,173,0.6)]"
            : "border-white/20"
        }`}
      >
        {/* Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-dark-gray">
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            onError={(e) => {
              console.log('Image failed to load:', image);
              e.currentTarget.src = '/assets/The-Silence-We-Didnt-Break.png';
            }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-20"></div>

          {/* Badges - Removed */}

          {/* Content Overlay - Removed */}
        </div>

        {/* Text Content */}
        <div className="p-4">
          <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{title}</h3>
          <p className="text-gray-400 text-xs mb-3">{genre}</p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? "fill-primary text-primary"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-xs ml-1">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
