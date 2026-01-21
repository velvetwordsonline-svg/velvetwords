import { useState } from "react";
import { X } from "lucide-react";
import { Story, categories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminStoryFormModalProps {
  isOpen: boolean;
  story?: Story;
  onClose: () => void;
  onSave: (story: Story) => void;
}

export default function AdminStoryFormModal({
  isOpen,
  story,
  onClose,
  onSave,
}: AdminStoryFormModalProps) {
  const [formData, setFormData] = useState<Partial<Story>>(
    story || {
      title: "",
      author: "",
      description: "",
      coverImage: "",
      genre: "",
      categoryId: "",
      rating: 4.5,
      reviewCount: 0,
      totalChapters: 1,
      isTrending: false,
      createdAt: new Date().toISOString(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.author ||
      !formData.description ||
      !formData.categoryId
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const storyToSave: Story = {
      id: story?.id || `story-${Date.now()}`,
      title: formData.title,
      author: formData.author,
      description: formData.description,
      coverImage: formData.coverImage || "",
      genre: formData.genre || "",
      categoryId: formData.categoryId,
      rating: formData.rating || 4.5,
      reviewCount: formData.reviewCount || 0,
      totalChapters: formData.totalChapters || 1,
      isTrending: formData.isTrending || false,
      createdAt: formData.createdAt || new Date().toISOString(),
    };

    onSave(storyToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card border-[3px] border-primary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20 sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-white">
            {story ? "Edit Story" : "Add New Story"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Title *
              </label>
              <Input
                type="text"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Story title"
                className="bg-white/5 border-white/20"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Author *
              </label>
              <Input
                type="text"
                value={formData.author || ""}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Author name"
                className="bg-white/5 border-white/20"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/5 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-primary"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Genre
              </label>
              <Input
                type="text"
                value={formData.genre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                placeholder="e.g., Romance, Dark Romance"
                className="bg-white/5 border-white/20"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Total Chapters
              </label>
              <Input
                type="number"
                value={formData.totalChapters || 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalChapters: parseInt(e.target.value) || 1,
                  })
                }
                placeholder="Number of chapters"
                className="bg-white/5 border-white/20"
                min="1"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Rating (0-5)
              </label>
              <Input
                type="number"
                step="0.1"
                value={formData.rating || 4.5}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value) || 4.5,
                  })
                }
                placeholder="Rating"
                className="bg-white/5 border-white/20"
                min="0"
                max="5"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Review Count
              </label>
              <Input
                type="number"
                value={formData.reviewCount || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reviewCount: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Number of reviews"
                className="bg-white/5 border-white/20"
                min="0"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isTrending || false}
                  onChange={(e) =>
                    setFormData({ ...formData, isTrending: e.target.checked })
                  }
                  className="w-5 h-5"
                />
                <span className="text-white font-semibold">Trending</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Description *
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Story description"
              className="w-full px-4 py-2 bg-white/5 border-2 border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Cover Image URL
            </label>
            <Input
              type="url"
              value={formData.coverImage || ""}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              className="bg-white/5 border-white/20"
            />
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
            >
              {story ? "Update Story" : "Create Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
