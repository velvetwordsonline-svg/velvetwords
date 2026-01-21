import { BarChart3, TrendingUp, Users, BookOpen, Star, MessageSquare } from "lucide-react";
import { Story, User } from "@/lib/mockData";

interface AdminAnalyticsProps {
  stories: Story[];
  users: User[];
}

export default function AdminAnalytics({
  stories,
  users,
}: AdminAnalyticsProps) {
  const totalStories = stories.length;
  const trendingStories = stories.filter((s) => s.isTrending).length;
  const averageRating =
    stories.length > 0
      ? (stories.reduce((sum, s) => sum + s.rating, 0) / stories.length).toFixed(1)
      : 0;
  const totalReviews = stories.reduce((sum, s) => sum + s.reviewCount, 0);
  const averageChapters =
    stories.length > 0
      ? Math.round(
          stories.reduce((sum, s) => sum + s.totalChapters, 0) / stories.length
        )
      : 0;
  const totalUsers = users.length;

  const stats = [
    {
      label: "Total Stories",
      value: totalStories,
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Trending Stories",
      value: trendingStories,
      icon: TrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Avg Rating",
      value: averageRating,
      icon: Star,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      unit: "/5",
    },
    {
      label: "Total Reviews",
      value: totalReviews.toLocaleString(),
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Avg Chapters",
      value: averageChapters,
      icon: BarChart3,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`${stat.bgColor} border-[3px] border-white/20 rounded-lg p-6 hover:border-white/40 transition-colors`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                    <span className="text-lg ml-1">{stat.unit}</span>
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-60`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
