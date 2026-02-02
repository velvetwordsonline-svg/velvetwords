import { useState } from "react";
import { Flame } from "lucide-react";

interface CharacterCardProps {
  id: string;
  image: string;
  name: string;
  power: string;
  description: string;
  onCardClick?: () => void;
}

export default function CharacterCard({
  id,
  image,
  name,
  power,
  description,
  onCardClick,
}: CharacterCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer"
    >
      {/* Card */}
      <div
        className={`relative rounded-lg overflow-hidden bg-card border-[3px] transition-all duration-300 transform ${
          isHovered
            ? "border-secondary shadow-[0_0_25px_rgba(181,126,220,0.5)] scale-105"
            : "border-white/20"
        }`}
      >
        {/* Image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-dark-gray">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
        </div>

        {/* Content */}
        <div className="p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-white font-bold text-base">{name}</h3>
            <Flame className="w-4 h-4 text-secondary" />
          </div>

          <div className="mb-3">
            <span className="inline-block px-2 py-1 bg-secondary/20 text-secondary text-xs font-semibold rounded-full">
              {power}
            </span>
          </div>

          <p className="text-gray-400 text-xs line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
