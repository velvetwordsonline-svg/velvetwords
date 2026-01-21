import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Story, Chapter } from "@/lib/mockData";
import { Input } from "@/components/ui/input";

interface AdminManageChaptersModalProps {
  isOpen: boolean;
  story: Story | null;
  chapters: Chapter[];
  onClose: () => void;
  onSave: (chapters: Chapter[]) => void;
}

export default function AdminManageChaptersModal({
  isOpen,
  story,
  chapters,
  onClose,
  onSave,
}: AdminManageChaptersModalProps) {
  const [editedChapters, setEditedChapters] = useState<Chapter[]>(chapters);
  const [newChapter, setNewChapter] = useState({
    title: "",
    content: "",
    estimatedReadTime: 10,
  });

  const handleAddChapter = () => {
    if (!newChapter.title.trim()) {
      alert("Please enter a chapter title");
      return;
    }

    const chapter: Chapter = {
      id: `chapter-${Date.now()}`,
      storyId: story?.id || "",
      number: editedChapters.length + 1,
      title: newChapter.title,
      content: newChapter.content,
      estimatedReadTime: newChapter.estimatedReadTime,
      images: [],
      isLocked: false,
      createdAt: new Date().toISOString(),
    };

    setEditedChapters([...editedChapters, chapter]);
    setNewChapter({ title: "", content: "", estimatedReadTime: 10 });
  };

  const handleRemoveChapter = (index: number) => {
    setEditedChapters(editedChapters.filter((_, i) => i !== index));
  };

  const handleChapterChange = (
    index: number,
    field: keyof Chapter,
    value: any
  ) => {
    const updated = [...editedChapters];
    updated[index] = { ...updated[index], [field]: value };
    setEditedChapters(updated);
  };

  const handleSave = () => {
    onSave(editedChapters);
    onClose();
  };

  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card border-[3px] border-primary rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20 sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-white">
            Manage Chapters: {story.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Chapter Section */}
          <div className="border-[3px] border-white/20 rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-4">Add New Chapter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Chapter Title
                </label>
                <Input
                  type="text"
                  value={newChapter.title}
                  onChange={(e) =>
                    setNewChapter({ ...newChapter, title: e.target.value })
                  }
                  placeholder={`Chapter ${editedChapters.length + 1}`}
                  className="bg-white/5 border-white/20"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Content Preview
                </label>
                <textarea
                  value={newChapter.content}
                  onChange={(e) =>
                    setNewChapter({ ...newChapter, content: e.target.value })
                  }
                  placeholder="Chapter content (first 500 characters)"
                  className="w-full px-4 py-2 bg-white/5 border-2 border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Estimated Read Time (minutes)
                </label>
                <Input
                  type="number"
                  value={newChapter.estimatedReadTime}
                  onChange={(e) =>
                    setNewChapter({
                      ...newChapter,
                      estimatedReadTime: parseInt(e.target.value) || 10,
                    })
                  }
                  placeholder="10"
                  className="bg-white/5 border-white/20"
                  min="1"
                />
              </div>

              <button
                onClick={handleAddChapter}
                className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Chapter
              </button>
            </div>
          </div>

          {/* Existing Chapters */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              Existing Chapters ({editedChapters.length})
            </h3>
            <div className="space-y-4">
              {editedChapters.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No chapters yet. Add one above.
                </p>
              ) : (
                editedChapters.map((chapter, idx) => (
                  <div
                    key={chapter.id}
                    className="border-[3px] border-white/20 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold rounded">
                            CH {chapter.number}
                          </span>
                          <Input
                            type="text"
                            value={chapter.title}
                            onChange={(e) =>
                              handleChapterChange(idx, "title", e.target.value)
                            }
                            className="flex-1 bg-white/5 border-white/20"
                          />
                        </div>
                        <p className="text-gray-400 text-sm mt-2">
                          {chapter.content.substring(0, 100)}...
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          {chapter.estimatedReadTime} min read • Created{" "}
                          {new Date(chapter.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveChapter(idx)}
                        className="p-2 hover:bg-destructive/20 text-destructive rounded transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
            >
              Save Chapters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
