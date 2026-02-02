import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 mb-6">
            Last updated: January 2024
          </p>
          <p className="text-gray-300 mb-4">
            At Velvet Words, we are committed to protecting your privacy and ensuring you have a positive experience on our platform.
          </p>
          <p className="text-gray-300">
            This privacy policy outlines how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
