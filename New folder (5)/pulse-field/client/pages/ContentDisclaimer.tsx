import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ContentDisclaimer() {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-white mb-8">Content Disclaimer</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 mb-6">
            Last updated: January 2024
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Age Requirement</h2>
          <p className="text-gray-300 mb-4">
            Velvet Words is intended for readers aged 18 and above. Our platform contains mature content including but not limited to romantic and adult themes.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Content Warning</h2>
          <p className="text-gray-300">
            All stories on Velvet Words are clearly labeled with genre and content warnings to help you make informed choices about what to read.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
