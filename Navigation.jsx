import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, Search, Menu, X, User, LogOut } from 'lucide-react';
import SubscriptionPopup from './SubscriptionPopup';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userPhone, setUserPhone] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const phone = localStorage.getItem('userPhone');
    if (phone) {
      setUserPhone(phone);
      checkSubscriptionStatus(phone);
    }
  }, []);

  const checkSubscriptionStatus = async (phone) => {
    try {
      const response = await fetch(`http://localhost:5001/api/subscription/status/${phone}`);
      const data = await response.json();
      setUserSubscription(data.subscription);
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    }
  };

  const handleLogin = () => {
    setShowLoginPopup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userPhone');
    setUserPhone(null);
    setUserSubscription(null);
    navigate('/');
  };

  const handleLoginSuccess = () => {
    const phone = localStorage.getItem('userPhone');
    setUserPhone(phone);
    if (phone) {
      checkSubscriptionStatus(phone);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b-[3px] border-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-purple-600/20">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <span className="hidden sm:inline text-lg font-bold text-white tracking-wide">
                Velvet Words
              </span>
              <span className="sm:hidden text-lg font-bold text-white">VW</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => navigate('/')}
                className={`transition-colors font-medium text-sm ${
                  isActive('/') ? 'text-purple-400' : 'text-white hover:text-purple-400'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/categories')}
                className={`transition-colors font-medium text-sm ${
                  isActive('/categories') ? 'text-purple-400' : 'text-white hover:text-purple-400'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => navigate('/library')}
                className={`transition-colors font-medium text-sm ${
                  isActive('/library') ? 'text-purple-400' : 'text-white hover:text-purple-400'
                }`}
              >
                Library
              </button>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xs mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-purple-400 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* User Section */}
            <div className="hidden md:flex items-center gap-4">
              {userPhone ? (
                <div className="flex items-center gap-3">
                  {/* User Info */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 border-2 border-purple-600 flex items-center justify-center">
                      <span className="text-purple-400 font-bold text-sm">
                        {userPhone.charAt(0)}
                      </span>
                    </div>
                    <div className="text-xs">
                      <div className="text-white font-medium">{userPhone}</div>
                      <div className="text-gray-400">
                        {userSubscription ? 'Premium' : 'Free'}
                      </div>
                    </div>
                  </div>

                  {/* Account & Logout */}
                  <button
                    onClick={() => navigate('/account')}
                    className="p-2 text-white hover:text-purple-400 transition-colors"
                    title="Account"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-white hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-purple-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/');
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    isActive('/') ? 'bg-purple-600/20 text-purple-400' : 'text-white hover:bg-white/5'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    navigate('/categories');
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    isActive('/categories') ? 'bg-purple-600/20 text-purple-400' : 'text-white hover:bg-white/5'
                  }`}
                >
                  Categories
                </button>
                <button
                  onClick={() => {
                    navigate('/library');
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    isActive('/library') ? 'bg-purple-600/20 text-purple-400' : 'text-white hover:bg-white/5'
                  }`}
                >
                  Library
                </button>
              </div>

              {/* Mobile User Section */}
              <div className="border-t border-white/10 pt-4">
                {userPhone ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-8 h-8 rounded-full bg-purple-600/20 border-2 border-purple-600 flex items-center justify-center">
                        <span className="text-purple-400 font-bold text-sm">
                          {userPhone.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{userPhone}</div>
                        <div className="text-gray-400 text-xs">
                          {userSubscription ? 'Premium User' : 'Free User'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/account');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Account
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Popup */}
      <SubscriptionPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Navigation;