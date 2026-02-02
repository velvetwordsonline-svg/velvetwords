import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function CancellationRefund() {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Cancellation & Refund Policy
          </h1>
          
          <div className="bg-gray-900/50 rounded-lg p-8 border border-purple-600/30">
            <p className="text-gray-400 text-sm mb-6">Last updated on 02-02-2026 10:51:45</p>
            
            <div className="text-gray-300 space-y-6">
              <p>
                Velvet Words believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
              </p>
              
              <ul className="space-y-4 list-disc list-inside">
                <li>
                  Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                </li>
                
                <li>
                  Velvet Words does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                </li>
                
                <li>
                  In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 2 Days days of receipt of the products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2 Days days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
                </li>
                
                <li>
                  In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them. In case of any Refunds approved by the Velvet Words, it'll take 3-5 Days days for the refund to be processed to the end customer.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}