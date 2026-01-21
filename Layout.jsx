import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children, showFooter = true }) => {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      
      {/* Main Content with proper spacing for fixed nav */}
      <main className="pt-16">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;