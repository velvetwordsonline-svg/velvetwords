import { useEffect, useState } from "react";
import { Play } from "lucide-react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { label: "Stories", value: "10K+" },
    { label: "Artists", value: "500+" },
    { label: "Readers", value: "1M+" },
  ];

  return (
    <div className="relative w-full h-screen mt-16 overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay - Lighter for clearer video visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/30" style={{ zIndex: 1 }}></div>
      
      {/* Additional subtle overlay for center content area */}
      <div className="absolute inset-0 bg-black/20" style={{ zIndex: 1 }}></div>
      
      {/* Bottom fade effect for video */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/95 via-black/60 to-transparent" style={{ zIndex: 1 }}></div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center" style={{ zIndex: 2 }}>
        {/* Animated Title */}
        <div className="mb-8 animate-in fade-in duration-1000">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_8px_rgba(0,0,0,0.9)]">
            Velvet
            <span className="text-primary ml-2 drop-shadow-[0_2px_6px_rgba(106,13,173,0.5)] [text-shadow:_1px_1px_4px_rgba(106,13,173,0.6)]">Words</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_1px_1px_4px_rgba(0,0,0,1)] font-medium">
            Discover premium romantic and mature stories. Feel every emotion, every moment, immersively.
          </p>
        </div>

        {/* CTA Button */}
        <button className="group relative mt-8 mb-16 px-8 py-4 bg-black/50 backdrop-blur-sm border-[3px] border-primary text-white font-bold text-lg flex items-center gap-2 rounded-lg hover:shadow-[0_0_30px_rgba(106,13,173,0.6)] hover:bg-black/70 transition-all duration-300 transform hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          <Play className="w-5 h-5 fill-current" />
          Explore the Romance
          <div className="absolute -inset-1 bg-primary/20 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
        </button>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 sm:gap-16 w-full max-w-2xl mb-16 py-8 border-t border-b border-white/30 bg-black/30 backdrop-blur-sm rounded-lg px-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group cursor-pointer">
              <p className="text-3xl sm:text-4xl font-bold text-primary group-hover:text-secondary transition-colors drop-shadow-[0_2px_8px_rgba(106,13,173,0.6)] [text-shadow:_1px_1px_4px_rgba(0,0,0,0.8)]">
                {stat.value}
              </p>
              <p className="text-gray-200 text-sm sm:text-base mt-2 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] [text-shadow:_1px_1px_3px_rgba(0,0,0,1)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
