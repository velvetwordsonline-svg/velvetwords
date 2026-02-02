import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Edit2, Zap, Clock, CheckCircle, Lock, User } from 'lucide-react';
import Layout from './Layout';
import SubscriptionPopup from './SubscriptionPopup';

const Account = () => {
  const navigate = useNavigate();
  const [userPhone, setUserPhone] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    // FORCE LOGOUT FOR TESTING - REMOVE AFTER TESTING
    localStorage.clear();
    setUserPhone(null);
    setLoading(false);
    return;
    
    const phone = localStorage.getItem('userPhone');
    console.log('=== DEBUG INFO ===');
    console.log('Phone from localStorage:', phone);
    console.log('Phone type:', typeof phone);
    console.log('Phone length:', phone ? phone.length : 'null');
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('==================');
    
    // Force clear if phone is empty string or invalid
    if (!phone || phone === 'null' || phone === 'undefined' || phone.trim() === '') {
      localStorage.removeItem('userPhone');
      setUserPhone(null);
      setLoading(false);
      return;
    }
    
    setUserPhone(phone);
    await checkSubscriptionStatus(phone);
    setLoading(false);
  };

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

  const handleLoginSuccess = () => {
    checkUserStatus();
  };

  const handleLogout = () => {
    localStorage.removeItem('userPhone');
    setUserPhone(null);
    setUserSubscription(null);
    navigate('/');
  };

  const isSubscriptionActive = userSubscription && 
    userSubscription.isActive && 
    new Date(userSubscription.expiryDate) > new Date();

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </Layout>
    );
  }

  if (!userPhone) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <User className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Sign In Required</h1>
            <p className="text-gray-400 mb-8">
              Please log in to access your account and reading history.
            </p>
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Login Now
            </button>
            
            {/* Debug: Force logout button */}
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Debug Info:</p>
              <p className="text-gray-300 text-xs mb-3">Phone: {localStorage.getItem('userPhone') || 'null'}</p>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 w-full"
              >
                Clear Storage & Reload
              </button>
            </div>
          </div>
        </div>

        <SubscriptionPopup
          isOpen={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
          onSuccess={handleLoginSuccess}
        />
      </Layout>
    );
  }

  const getDaysLeft = () => {
    if (!userSubscription || !userSubscription.expiryDate) return 0;
    const now = new Date();
    const expiry = new Date(userSubscription.expiryDate);
    const diffTime = expiry - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Account Header */}
        <div className="mb-16">
          <div
            className={`bg-gray-900 border-[3px] rounded-lg p-8 transition-all ${
              isSubscriptionActive ? "border-purple-600 shadow-[0_0_30px_rgba(147,51,234,0.4)]" : "border-white/20"
            }`}
          >
            <div className="flex items-start justify-between gap-8 flex-col sm:flex-row">
              {/* User Info */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  {userPhone.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
                  <p className="text-gray-400 text-lg mb-4">Mobile: {userPhone}</p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
                        isSubscriptionActive
                          ? "bg-purple-600/20 text-purple-400"
                          : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      {isSubscriptionActive ? "Active" : "No Subscription"}
                    </span>
                    {userSubscription && (
                      <span className="text-gray-400 text-sm capitalize">
                        {userSubscription.planType} Plan
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button 
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600/20 text-purple-400 font-bold rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-600/50"
                >
                  <Edit2 className="w-4 h-4" />
                  Manage Subscription
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600/20 text-red-400 font-bold rounded-lg hover:bg-red-600/30 transition-colors border border-red-600/50"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        {isSubscriptionActive && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gray-900 border-[3px] border-white/20 rounded-lg p-6">
              <p className="text-gray-400 text-sm font-semibold mb-2">Plan</p>
              <p className="text-white font-bold text-2xl capitalize">
                {userSubscription.planType}
              </p>
            </div>
            <div className="bg-gray-900 border-[3px] border-white/20 rounded-lg p-6">
              <p className="text-gray-400 text-sm font-semibold mb-2">Expires</p>
              <p className="text-white font-bold text-2xl">
                {new Date(userSubscription.expiryDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-900 border-[3px] border-white/20 rounded-lg p-6">
              <p className="text-gray-400 text-sm font-semibold mb-2">Days Left</p>
              <p className="text-purple-400 font-bold text-2xl">
                {getDaysLeft()}
              </p>
            </div>
          </div>
        )}

        {/* No Subscription State */}
        {!isSubscriptionActive && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">No Active Subscription</h2>
              <p className="text-gray-400 mb-8">
                Subscribe to unlock unlimited access to all stories and chapters.
              </p>
              <button
                onClick={handleLogin}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 border-[3px] border-white/20 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Unlimited Stories</h3>
            <p className="text-gray-400 text-sm">
              Access to our entire library of premium stories
            </p>
          </div>

          <div className="bg-gray-900 border-[3px] border-white/20 rounded-lg p-6 text-center">
            <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Ad-Free Reading</h3>
            <p className="text-gray-400 text-sm">
              Enjoy uninterrupted reading experience
            </p>
          </div>

          <div className="bg-gray-900 border-[3px] border-white/20 rounded-lg p-6 text-center">
            <Clock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Early Access</h3>
            <p className="text-gray-400 text-sm">
              Get new chapters before anyone else
            </p>
          </div>
        </div>
      </div>

      <SubscriptionPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onSuccess={handleLoginSuccess}
      />
    </Layout>
  );
};

export default Account;