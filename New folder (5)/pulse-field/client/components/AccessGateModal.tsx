import { useState } from "react";
import { X, Check, Lock } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { subscriptionPlans } from "@/lib/mockData";

interface AccessGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AccessGateModal({ isOpen, onClose, onSuccess }: AccessGateModalProps) {
  const { verifyPhoneNumber, selectSubscription } = useApp();
  const [step, setStep] = useState<"phone" | "subscription" | "checkout">("phone");
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly" | "3-month" | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePhoneVerify = () => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (cleanPhone === "9999999999") {
      // Special test number - instant unlock
      verifyPhoneNumber(phone);
      selectSubscription("3-month");
      onSuccess();
      return;
    }

    // Normal flow
    verifyPhoneNumber(phone);
    setStep("subscription");
  };

  const handleSubscriptionSelect = () => {
    if (!selectedPlan) return;
    setStep("checkout");
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !cardExpiry || !cardCVV) {
      alert("Please fill in all payment details");
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      if (selectedPlan) {
        selectSubscription(selectedPlan);
        setProcessing(false);
        onSuccess();
      }
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="story-title" 
      className="
        fixed top-0 right-0 h-screen z-40
        w-full sm:w-[70%] md:w-[420px]
        bg-[#050505] border-l-2 border-t-2 border-b-2 border-purple-600
        rounded-tl-2xl rounded-bl-2xl
        shadow-[-8px_0_40px_rgba(124,58,237,0.4)]
        transition-transform duration-[350ms] ease-in-out
        overflow-y-auto
        translate-x-0
      "
    >
      <div className="p-6 pt-16 pb-8">
        <button 
          className="absolute top-2 right-2 z-50 p-3 rounded-full text-white bg-red-600 hover:bg-red-700 border-2 border-white shadow-lg transition-all duration-300" 
          aria-label="Close story details"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="mb-6">
          <div className="w-full aspect-square bg-[#0b0b0b] rounded-xl border-[1.5px] border-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.2)]">
z            <img src="http://localhost:5001/thumbnails/1768607011344-Kanav.png" alt="admin" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
        
        <h2 id="story-title" className="text-white text-2xl font-semibold mb-4 leading-tight">admin</h2>
        
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm text-gray-400 flex items-center gap-1">romance</span>
          <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-600/50 text-purple-400 text-xs font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-3 h-3" aria-hidden="true">
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
              <path d="M20 2v4"></path>
              <path d="M22 4h-4"></path>
              <circle cx="4" cy="20" r="2"></circle>
            </svg>
            AI-Generated
          </span>
        </div>
        
        <div className="mb-8">
          <p className="text-[#b5b5b5] text-sm leading-relaxed mb-2">Detail and description</p>
          <p className="text-[#b5b5b5] text-base leading-[1.6]">A captivating story description goes here...</p>
        </div>
        
        <div className="space-y-3">
          <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold text-base transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] active:scale-[0.98]">
            Read Story
          </button>
          <button className="w-full py-3.5 rounded-xl bg-transparent border-[1.5px] border-purple-600 text-white font-semibold text-base transition-all duration-300 ease-in-out hover:bg-purple-600/10 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98]">
            Add to Library
          </button>
        </div>
      </div>
    </div>
  );
}