import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <h1 className="text-5xl font-bold text-white mb-4">Search Results</h1>
        <p className="text-gray-400 text-lg mb-8">
          {query ? `Results for "${query}"` : "Search for stories to get started"}
        </p>
        <p className="text-gray-500">
          Refine your search with filters like genre, rating, and popularity.
        </p>
      </div>
      <Footer />
    </div>
  );
}
