import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {

  return (
    <footer className="bg-black border-t-[3px] border-primary mt-24">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <Zap className="w-5 h-5 text-primary" fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-white">Velvet Words</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Immerse yourself in premium romantic and mature stories. A cinematic story streaming experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Library
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/cancellation-refund" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Contact Info */}
          <div className="mb-6 text-center sm:text-left">
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-semibold text-white">Email:</span> velvetwordsonline@gmail.com
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
}
