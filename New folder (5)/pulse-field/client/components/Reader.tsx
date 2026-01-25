import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Menu, X, ArrowLeft } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface ReaderProps {
  storyId: string;
  chapterId: string;
  chapters: Array<{ id: string; number: number; title: string; estimatedReadTime: number }>;
  currentChapter: {
    id: string;
    storyId: string;
    chapterNumber: number;
    title: string;
    content: Array<{ type: string; data: string; order: number }>;
    estimatedReadTime: number;
  };
  onNavigate: (chapterId: string) => void;
}

export default function Reader({ storyId, chapterId, chapters, currentChapter, onNavigate }: ReaderProps) {
  const { updateReadingProgress, getChaptersByStoryId, canAccessChapter, user } = useApp();
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  const previousChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  // Check if user can access this chapter
  const hasAccess = canAccessChapter(currentChapter.chapterNumber);

  // If no access, show subscription prompt
  if (!hasAccess) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">Subscription Required</h2>
          <p className="text-gray-400 mb-6">
            Subscribe to unlock Chapter {currentChapter.chapterNumber} and continue reading this amazing story.
          </p>
          <button
            onClick={() => window.location.href = '/account'}
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90"
          >
            Get Subscription
          </button>
        </div>
      </div>
    );
  }

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const totalHeight = scrollHeight - clientHeight;
        const progress = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
        setScrollProgress(progress);

        // Update reading progress
        const percentage = Math.round(progress);
        if (currentChapter) {
          updateReadingProgress(storyId, currentChapter.chapterNumber, scrollTop, percentage);
        }
      }
    };

    const ref = contentRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, [storyId, currentChapter, updateReadingProgress]);

  // Auto-hide controls - REMOVED to keep controls persistent
  // useEffect(() => {
  //   if (showControls) {
  //     const hideControlsTimer = setTimeout(() => {
  //       setShowControls(false);
  //     }, 5000);
  //     return () => clearTimeout(hideControlsTimer);
  //   }
  // }, [showControls]);

  if (!currentChapter) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <p>Chapter not found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-40">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-white/5"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-black to-transparent z-30 px-6 py-12 pt-32">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 text-center">{currentChapter.title}</h1>
          <p className="text-gray-400 text-center">Chapter {currentChapter.chapterNumber}</p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-24">
          <div
            className="prose prose-invert max-w-none"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
            }}
          >
            {/* Render content blocks */}
            <div className="space-y-8 text-gray-300">
              {currentChapter.content
                .sort((a, b) => a.order - b.order)
                .map((block, idx) => (
                  <div key={idx}>
                    {block.type === 'text' ? (
                      <p className="leading-relaxed">{block.data}</p>
                    ) : block.type === 'image' ? (
                      <div className="my-8">
                        <img
                          src={block.data}
                          alt={`Chapter illustration ${idx}`}
                          className="w-full rounded-lg border border-primary/30"
                        />
                        <p className="text-center text-xs text-gray-500 mt-2 italic">Story illustration</p>
                      </div>
                    ) : null}
                  </div>
                ))}
            </div>
          </div>

          {/* Chapter Navigation */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <div className="grid grid-cols-2 gap-4">
              {previousChapter && canAccessChapter(previousChapter.number) ? (
                <button
                  onClick={() => onNavigate(previousChapter.id)}
                  className="p-4 border-[3px] border-white/20 rounded-lg hover:border-primary text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-primary mb-2 group-hover:text-secondary">
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs font-bold">PREVIOUS</span>
                  </div>
                  <p className="text-white font-bold">Chapter {previousChapter.number}</p>
                  <p className="text-gray-400 text-sm">Previous Chapter</p>
                </button>
              ) : (
                <div></div>
              )}

              {nextChapter && canAccessChapter(nextChapter.number) ? (
                <button
                  onClick={() => onNavigate(nextChapter.id)}
                  className="p-4 border-[3px] border-white/20 rounded-lg hover:border-primary text-right transition-all group"
                >
                  <div className="flex items-center justify-end gap-2 text-primary mb-2 group-hover:text-secondary">
                    <span className="text-xs font-bold">NEXT</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <p className="text-white font-bold">Chapter {nextChapter.number}</p>
                  <p className="text-gray-400 text-sm">Next Chapter</p>
                </button>
              ) : nextChapter ? (
                <button
                  onClick={() => window.location.href = '/account'}
                  className="p-4 border-[3px] border-yellow-500/50 rounded-lg hover:border-yellow-500 text-right transition-all group bg-yellow-500/10"
                >
                  <div className="flex items-center justify-end gap-2 text-yellow-500 mb-2">
                    <span className="text-xs font-bold">LOCKED</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <p className="text-white font-bold">Chapter {nextChapter.number}</p>
                  <p className="text-yellow-400 text-sm">Subscribe to unlock</p>
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <div className="py-8 text-center text-gray-500 text-sm">
            Chapter {currentChapter.chapterNumber} of {chapters.length}
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar - Always Visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent border-t border-primary/30 translate-y-0 z-30">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="px-3 py-2 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors text-sm font-bold"
                >
                  A−
                </button>
                <span className="text-white text-sm px-2">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="px-3 py-2 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors text-sm font-bold"
                >
                  A+
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                  className="px-3 py-2 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors text-sm font-bold border border-primary/30"
                >
                  <option value={1.4}>1.4 Lines</option>
                  <option value={1.6}>1.6 Lines</option>
                  <option value={1.8}>1.8 Lines</option>
                  <option value={2}>2.0 Lines</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Controls (Always Visible) */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 pt-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 bg-black/50 hover:bg-primary/20 text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
