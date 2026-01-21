import { useEffect } from "react";
import { X, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StoryDetailSliderProps {
  isOpen: boolean;
  onClose: () => void;
  story: {
    id: string;
    title: string;
    description: string;
    category?: string;
    readTime?: string;
    coverImage?: string;
  } | null;
}

export default function StoryDetailSlider({
  isOpen,
  onClose,
  story,
}: StoryDetailSliderProps) {
  const navigate = useNavigate();

  const handleReadStory = () => {
    if (story?.id) {
      navigate(`/story/${story.id}`);
      onClose();
    }
  };
  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!story) return null;

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm z-30
          transition-opacity duration-350 ease-in-out
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slider Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-title"
        className={`
          fixed top-0 right-0 h-screen z-40
          w-full sm:w-[70%] md:w-[420px]
          bg-[#050505] border-l-2 border-t-2 border-b-2 border-purple-600
          rounded-tl-2xl rounded-bl-2xl
          shadow-[-8px_0_40px_rgba(124,58,237,0.4)]
          transition-transform duration-[350ms] ease-in-out
          overflow-y-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            p-2 rounded-lg
            text-white/70 hover:text-white
            bg-white/5 hover:bg-white/10
            border border-white/10 hover:border-purple-600
            transition-all duration-300
            hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]
          "
          aria-label="Close story details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 pt-16 pb-8">
          {/* Thumbnail */}
          <div className="mb-6">
            <div
              className="
                w-full aspect-square
                bg-[#0b0b0b] rounded-xl
                border-[1.5px] border-purple-600
                flex items-center justify-center
                shadow-[0_0_20px_rgba(124,58,237,0.2)]
              "
            >
              {story.coverImage ? (
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-white/40 text-lg font-medium">
                  Thumbnail
                </span>
              )}
            </div>
          </div>

          {/* Story Title */}
          <h2
            id="story-title"
            className="text-white text-2xl font-semibold mb-4 leading-tight"
          >
            {story.title}
          </h2>

          {/* Metadata Row */}
          {(story.category || story.readTime) && (
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {story.category && (
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  {story.category}
                </span>
              )}
              {story.readTime && (
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {story.readTime}
                </span>
              )}
              <span
                className="
                  px-3 py-1 rounded-full
                  bg-purple-600/20 border border-purple-600/50
                  text-purple-400 text-xs font-medium
                  flex items-center gap-1
                "
              >
                <Sparkles className="w-3 h-3" />
                AI-Generated
              </span>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <p className="text-[#b5b5b5] text-sm leading-relaxed mb-2">
              Detail and description
            </p>
            <p className="text-[#b5b5b5] text-base leading-[1.6]">
              {story.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Button */}
            <button
              onClick={handleReadStory}
              className="
                w-full py-3.5 rounded-xl
                bg-gradient-to-r from-purple-600 to-purple-700
                text-white font-semibold text-base
                transition-all duration-300 ease-in-out
                hover:scale-[1.02]
                hover:shadow-[0_0_25px_rgba(124,58,237,0.6)]
                active:scale-[0.98]
              "
            >
              Read Story
            </button>

            {/* Secondary Button */}
            <button
              className="
                w-full py-3.5 rounded-xl
                bg-transparent border-[1.5px] border-purple-600
                text-white font-semibold text-base
                transition-all duration-300 ease-in-out
                hover:bg-purple-600/10
                hover:scale-[1.02]
                hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]
                active:scale-[0.98]
              "
            >
              Add to Library
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
