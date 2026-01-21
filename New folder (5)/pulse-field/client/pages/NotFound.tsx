import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            404
          </h1>
          <p className="text-2xl sm:text-3xl font-bold text-white mb-4">Page Not Found</p>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            The story you're looking for doesn't exist in our library. Let's get you back to discovering amazing content.
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(106,13,173,0.6)] transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
