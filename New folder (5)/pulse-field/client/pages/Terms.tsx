import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 mb-6">
            Last updated: January 2024
          </p>
          <p className="text-gray-300 mb-4">
            Velvet Words is a premium story streaming platform dedicated to delivering high-quality romantic and mature content to our readers.
          </p>
          <p className="text-gray-300">
            These terms of service govern your use of the Velvet Words platform. By accessing and using our service, you agree to be bound by these terms.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
