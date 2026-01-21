import { useState } from "react";
import { X, Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import AdminStoryFormModal from "@/components/AdminStoryFormModal";
import AdminManageChaptersModal from "@/components/AdminManageChaptersModal";
import AdminSubscriptionPlanModal from "@/components/AdminSubscriptionPlanModal";
import AdminStoryFilters from "@/components/AdminStoryFilters";
import AdminAnalytics from "@/components/AdminAnalytics";
import { useAdmin } from "@/contexts/AdminContext";
import { Story, Chapter, generateChapters } from "@/lib/mockData";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  active: boolean;
  badge?: string;
}

type SortType = "newest" | "oldest" | "rating" | "reviews" | "title";

export default function Admin() {
  const { stories: initialStories, user, updateStories } = useAdmin();
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"stories" | "users" | "subscriptions">("stories");

  // Story management
  const [storyList, setStoryList] = useState<Story[]>(initialStories);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [showChaptersModal, setShowChaptersModal] = useState(false);
  const [selectedStoryForChapters, setSelectedStoryForChapters] = useState<Story | null>(null);
  const [storyChapters, setStoryChapters] = useState<Chapter[]>([]);

  // Subscription management
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: "weekly",
      name: "Weekly Pass",
      price: "$2.99",
      duration: "7 days",
      active: true,
    },
    {
      id: "monthly",
      name: "Monthly Plan",
      price: "$9.99",
      duration: "30 days",
      active: true,
      badge: "Popular",
    },
    {
      id: "3-month",
      name: "3-Month Premium",
      price: "$24.99",
      duration: "90 days",
      active: true,
    },
  ]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [showPassword, setShowPassword] = useState(false);

  // Filter and sort stories
  const filteredStories = storyList
    .filter((story) => {
      const matchesSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || story.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Auth handlers
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setIsAuthenticated(true);
      setAdminPassword("");
    } else {
      alert("Invalid admin password");
    }
  };

  // Story handlers
  const handleSaveStory = (story: Story) => {
    if (editingStory) {
      const updated = storyList.map((s) => (s.id === story.id ? story : s));
      setStoryList(updated);
      updateStories(updated);
      setEditingStory(null);
    } else {
      const updated = [...storyList, story];
      setStoryList(updated);
      updateStories(updated);
    }
    setShowStoryForm(false);
  };

  const handleDeleteStory = (id: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      const updated = storyList.filter((s) => s.id !== id);
      setStoryList(updated);
      updateStories(updated);
      setSelectedStories((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedStories.size === 0) {
      alert("Please select stories to delete");
      return;
    }
    if (confirm(`Delete ${selectedStories.size} story(stories)?`)) {
      const updated = storyList.filter((s) => !selectedStories.has(s.id));
      setStoryList(updated);
      updateStories(updated);
      setSelectedStories(new Set());
    }
  };

  const handleOpenChaptersModal = (story: Story) => {
    setSelectedStoryForChapters(story);
    setStoryChapters(generateChapters(story.id, story.title, story.totalChapters));
    setShowChaptersModal(true);
  };

  const handleSaveChapters = (chapters: Chapter[]) => {
    setStoryChapters(chapters);
    alert(`Saved ${chapters.length} chapters for ${selectedStoryForChapters?.title}`);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setShowPlanModal(true);
  };

  const handleSavePlan = (updatedPlan: SubscriptionPlan) => {
    setSubscriptionPlans(
      subscriptionPlans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    setShowPlanModal(false);
  };

  const toggleStorySelection = (storyId: string) => {
    const newSet = new Set(selectedStories);
    if (newSet.has(storyId)) {
      newSet.delete(storyId);
    } else {
      newSet.add(storyId);
    }
    setSelectedStories(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedStories.size === filteredStories.length) {
      setSelectedStories(new Set());
    } else {
      setSelectedStories(new Set(filteredStories.map((s) => s.id)));
    }
  };

  // Auth view
  if (!isAuthenticated) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="bg-card border-[3px] border-primary rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400 mb-6">Enter admin credentials to continue</p>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-white font-semibold mb-2">Admin Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1">Demo password: admin123</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin view
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-destructive text-white font-bold rounded-lg hover:bg-destructive/90 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Analytics */}
        {activeTab === "stories" && <AdminAnalytics stories={storyList} users={user ? [user] : []} />}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/20">
          {["stories", "users", "subscriptions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-6 py-3 font-bold border-b-[3px] transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stories Tab */}
        {activeTab === "stories" && (
          <div className="space-y-6">
            {/* Filters */}
            <AdminStoryFilters
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              sortBy={sortBy}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onSortChange={setSortBy}
              onReset={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setSortBy("newest");
              }}
            />

            {/* Stories Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">
                  Manage Stories ({filteredStories.length})
                </h2>
                {selectedStories.size > 0 && (
                  <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold rounded-full">
                    {selectedStories.size} selected
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {selectedStories.size > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-destructive text-white font-bold rounded-lg hover:bg-destructive/90 transition-all"
                  >
                    Delete ({selectedStories.size})
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingStory(null);
                    setShowStoryForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5" />
                  Add Story
                </button>
              </div>
            </div>

            {/* Bulk Select */}
            {filteredStories.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-white/5 border-[3px] border-white/20 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedStories.size === filteredStories.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 cursor-pointer"
                />
                <label className="text-white font-semibold cursor-pointer flex-1">
                  Select All ({filteredStories.length})
                </label>
              </div>
            )}

            {/* Stories Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredStories.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No stories found. Try adjusting your filters.</p>
                </div>
              ) : (
                filteredStories.map((story) => (
                  <div
                    key={story.id}
                    className="border-[3px] border-white/20 rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedStories.has(story.id)}
                        onChange={() => toggleStorySelection(story.id)}
                        className="w-5 h-5 cursor-pointer flex-shrink-0 mt-1"
                      />
                      <div
                        onClick={() =>
                          setExpandedStory(
                            expandedStory === story.id ? null : story.id
                          )
                        }
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-lg mb-1">
                              {story.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2">By {story.author}</p>
                            <div className="flex gap-2 flex-wrap">
                              <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                                {story.genre}
                              </span>
                              <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-semibold rounded">
                                {story.totalChapters} chapters
                              </span>
                              {story.isTrending && (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded">
                                  Trending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="flex gap-2 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setEditingStory(story);
                            setShowStoryForm(true);
                          }}
                          className="p-2 hover:bg-primary/20 text-primary rounded transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="p-2 hover:bg-destructive/20 text-destructive rounded transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {expandedStory === story.id && (
                      <div className="mt-4 pt-4 border-t border-white/20 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Rating</p>
                            <p className="text-white font-bold">{story.rating.toFixed(1)}/5.0</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Reviews</p>
                            <p className="text-white font-bold">{story.reviewCount}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm mb-2">Description</p>
                          <p className="text-white text-sm line-clamp-3">{story.description}</p>
                        </div>
                        <button
                          onClick={() => handleOpenChaptersModal(story)}
                          className="w-full py-2 bg-primary/20 text-primary font-bold rounded hover:bg-primary/30 transition-colors"
                        >
                          Manage Chapters
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
            {user ? (
              <div className="border-[3px] border-white/20 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">User ID</p>
                    <p className="text-white font-bold">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone Number</p>
                    <p className="text-white font-bold">{user.phone || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Verified</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-5 h-5 ${
                          user.isVerified ? "text-green-400" : "text-red-400"
                        }`}
                      />
                      <p className={`font-bold ${user.isVerified ? "text-green-400" : "text-red-400"}`}>
                        {user.isVerified ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Created</p>
                    <p className="text-white font-bold">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/20">
                  <h3 className="text-white font-bold mb-4">Subscription Info</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">Current Plan</p>
                      <p className="text-primary font-bold capitalize">
                        {user.subscription.plan || "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            user.subscription.isActive ? "bg-green-400" : "bg-gray-400"
                          }`}
                        />
                        <p
                          className={`font-bold ${
                            user.subscription.isActive ? "text-green-400" : "text-gray-400"
                          }`}
                        >
                          {user.subscription.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                    {user.subscription.expiresAt && (
                      <div className="col-span-2">
                        <p className="text-gray-400 text-sm">Expires</p>
                        <p className="text-white font-bold">
                          {new Date(user.subscription.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/20">
                  <h3 className="text-white font-bold mb-4">Reading Activity</h3>
                  <p className="text-gray-400 mb-4">
                    {user.readingHistory.length} stories in reading history
                  </p>
                  {user.readingHistory.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {user.readingHistory.map((history) => (
                        <div key={history.storyId} className="p-2 bg-white/5 rounded border border-white/10">
                          <p className="text-white text-sm font-bold">
                            Chapter {history.lastChapterRead} - {history.progressPercentage}% read
                          </p>
                          <p className="text-gray-400 text-xs">
                            Last read: {new Date(history.lastReadAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-[3px] border-white/20 rounded-lg p-6 text-center text-gray-400">
                <p>No user logged in</p>
              </div>
            )}
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="border-[3px] border-white/20 rounded-lg p-6 hover:border-primary transition-colors"
                >
                  {plan.badge && (
                    <span className="inline-block px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold rounded-full mb-2">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="text-white font-bold text-lg mb-2">{plan.name}</h3>
                  <p className="text-primary font-bold text-2xl mb-1">{plan.price}</p>
                  <p className="text-gray-400 text-sm mb-4">{plan.duration}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        plan.active ? "bg-green-400" : "bg-gray-400"
                      }`}
                    />
                    <span className="text-gray-400 text-xs">
                      {plan.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className="w-full py-2 border-2 border-primary text-primary font-bold rounded hover:bg-primary/10 transition-colors"
                  >
                    Edit Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AdminStoryFormModal
        isOpen={showStoryForm}
        story={editingStory || undefined}
        onClose={() => {
          setShowStoryForm(false);
          setEditingStory(null);
        }}
        onSave={handleSaveStory}
      />

      <AdminManageChaptersModal
        isOpen={showChaptersModal}
        story={selectedStoryForChapters}
        chapters={storyChapters}
        onClose={() => setShowChaptersModal(false)}
        onSave={handleSaveChapters}
      />

      <AdminSubscriptionPlanModal
        isOpen={showPlanModal}
        plan={editingPlan}
        onClose={() => {
          setShowPlanModal(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
      />
    </div>
  );
}

