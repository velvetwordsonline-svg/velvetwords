import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Search, Menu, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function Navigation() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useApp();
  
  const hasActiveSubscription = user?.subscription?.isActive && 
    user?.subscription?.expiresAt && 
    new Date(user.subscription.expiresAt) > new Date();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b-[3px] border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-lg bg-primary/20">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="currentColor" />
            </div>
            <span className="hidden sm:inline text-lg font-bold text-white tracking-wide">
              Velvet Words
            </span>
            <span className="sm:hidden text-sm font-bold text-white tracking-wide">
              Velvet Words
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-white hover:text-primary transition-colors font-medium text-sm"
            >
              Home
            </Link>
            {hasActiveSubscription && (
              <Link
                to="/library"
                className="text-white hover:text-primary transition-colors font-medium text-sm"
              >
                Library
              </Link>
            )}
            <Link
              to="/categories"
              className="text-white hover:text-primary transition-colors font-medium text-sm"
            >
              Categories
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-primary transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Desktop Account Link */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/account"
              className="text-white hover:text-primary transition-colors font-medium text-sm"
            >
              My Account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            <div className="mt-4 space-y-2">
              <form onSubmit={handleSearch} className="mb-4">
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                />
              </form>
              <Link
                to="/"
                className="block px-4 py-2 text-white hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {hasActiveSubscription && (
                <Link
                  to="/library"
                  className="block px-4 py-2 text-white hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Library
                </Link>
              )}
              <Link
                to="/categories"
                className="block px-4 py-2 text-white hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/account"
                className="block px-4 py-2 text-white hover:text-primary hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
