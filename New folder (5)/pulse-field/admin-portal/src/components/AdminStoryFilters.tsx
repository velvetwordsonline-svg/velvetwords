import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/mockData";

interface AdminStoryFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: "newest" | "oldest" | "rating" | "reviews" | "title";
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: typeof sortBy) => void;
  onReset: () => void;
}

export default function AdminStoryFilters({
  searchQuery,
  selectedCategory,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
}: AdminStoryFiltersProps) {
  const isFiltered =
    searchQuery || selectedCategory || sortBy !== "newest";

  return (
    <div className="space-y-4 p-4 bg-white/5 border-[3px] border-white/20 rounded-lg mb-6">
      <div className="flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search stories by title or author..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-white/5 border-white/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2 text-sm">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-primary text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2 text-sm">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as typeof sortBy)
            }
            className="w-full px-4 py-2 bg-white/5 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-primary text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="title">A - Z</option>
          </select>
        </div>

        <div className="flex items-end">
          {isFiltered && (
            <button
              onClick={onReset}
              className="w-full py-2 px-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

