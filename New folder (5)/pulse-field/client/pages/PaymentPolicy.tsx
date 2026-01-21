import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PaymentPolicy() {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-white mb-8">Payment Policy</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-400 mb-6">
            Last updated: January 2024
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Subscription Plans</h2>
          <p className="text-gray-300 mb-4">
            Velvet Words offers three subscription tiers: Weekly, Monthly, and 3-Month plans, each with increasing benefits.
          </p>
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Billing & Refunds</h2>
          <p className="text-gray-300">
            We process payments securely and provide clear billing statements. Refund policies apply according to local regulations.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
