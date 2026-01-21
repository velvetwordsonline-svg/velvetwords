import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // Handle newsletter subscription
      console.log('Newsletter subscription:', email);
      setEmail('');
      alert('Thank you for subscribing to our newsletter!');
    }
  };

  return (
    <footer className="bg-black border-t-[3px] border-purple-600 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-600/20">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-white">Velvet Words</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Immerse yourself in premium romantic and mature stories. A cinematic story streaming experience.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/library')}
                  className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/categories')}
                  className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/account')}
                  className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Account
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/content-disclaimer')}
                  className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Content Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/payment-policy')}
                  className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                >
                  Payment Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="border-t border-white/10 pt-8">
          <div className="mb-6 text-center sm:text-left">
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-semibold text-white">Email:</span> support@velvetwords.com
            </p>
            <p className="text-gray-400 text-sm">
              <span className="font-semibold text-white">Follow us:</span> Instagram • Twitter • Facebook
            </p>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-gray-500 text-xs text-center sm:text-left">
              © 2026 Velvet Words. All rights reserved. Made with passion for stories.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;