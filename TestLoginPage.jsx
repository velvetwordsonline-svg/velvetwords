import React, { useState } from 'react';
import { User } from 'lucide-react';
import SubscriptionPopup from './SubscriptionPopup';

const TestLoginPage = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleLogin = () => {
    console.log('Login button clicked');
    setShowLoginPopup(true);
  };

  const handleLoginSuccess = () => {
    console.log('Login successful');
    // Clear localStorage to test
    localStorage.removeItem('userPhone');
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <User className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-8">
            Please log in to access your account and reading history.
          </p>
          
          {/* Test Button - Always Visible */}
          <button
            onClick={handleLogin}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 mb-4"
          >
            Login Now
          </button>
          
          {/* Clear Storage Button */}
          <br />
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Clear Storage & Reload
          </button>
        </div>
      </div>

      <SubscriptionPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default TestLoginPage;