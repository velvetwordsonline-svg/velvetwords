import { useState } from "react";
import { Heart, Zap, Flame, Crown } from "lucide-react";

interface CategoryCardProps {
  id: string;
  image: string;
  name: string;
  icon: string;
  count: number;
  onCardClick?: () => void;
}

export default function CategoryCard({
  id,
  image,
  name,
  icon,
  count,
  onCardClick,
}: CategoryCardProps) {
  const getIcon = () => {
    const iconMap: { [key: string]: React.ReactNode } = {
      Heart: <Heart className="w-12 h-12 text-primary mb-3" />,
      Zap: <Zap className="w-12 h-12 text-primary mb-3" />,
      Flame: <Flame className="w-12 h-12 text-primary mb-3" />,
      Crown: <Crown className="w-12 h-12 text-primary mb-3" />,
    };
    return iconMap[icon] || <Heart className="w-12 h-12 text-primary mb-3" />;
  };
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
        className={`relative rounded-lg overflow-hidden h-64 border-[3px] transition-all duration-300 ${
          isHovered
            ? "border-primary shadow-[0_0_25px_rgba(106,13,173,0.5)] transform -translate-y-2"
            : "border-white/20"
        }`}
      >
        {/* Background Image */}
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-70" : "opacity-60"
          }`}
        ></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          {getIcon()}
          <h3 className="text-white font-bold text-xl mb-2">{name}</h3>
          <p className="text-gray-300 text-sm">{count} Stories</p>
        </div>
      </div>
    </div>
  );
}
