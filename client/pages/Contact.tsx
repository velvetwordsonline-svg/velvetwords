import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Contact Us
          </h1>
          
          <div className="bg-gray-900/50 rounded-lg p-8 border border-purple-600/30">
            <p className="text-gray-400 text-sm mb-6">Last updated on 02-02-2026 10:47:32</p>
            
            <div className="text-gray-300 space-y-6">
              <p className="mb-6">
                You may contact us using the information below:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Merchant Legal entity name:</h3>
                  <p>Velvet Words</p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">Registered Address:</h3>
                  <p>House No. 23, West Rajiv Nagar, Gali no. 7, Gurugram, Haryana, PIN: 122018</p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">Operational Address:</h3>
                  <p>House No. 23, West Rajiv Nagar, Gali no. 7, Gurugram, Haryana, PIN: 122018</p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">Telephone No:</h3>
                  <p>7049791125</p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">E-Mail ID:</h3>
                  <p>velvetwordsonline@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}