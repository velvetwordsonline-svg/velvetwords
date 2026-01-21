import { useState } from "react";
import { X, Phone } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { authenticatePhone, subscribeUser } from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { verifyPhoneNumber, selectSubscription } = useApp();
  const [step, setStep] = useState<"phone" | "subscription">("phone");
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const plans = [
    { id: "daily", name: "Daily", price: "₹10", duration: "1 day" },
    { id: "weekly", name: "Weekly", price: "₹20", duration: "7 days" },
    { id: "monthly", name: "Monthly", price: "₹30", duration: "30 days" }
  ];

  const handlePhoneSubmit = async () => {
    if (phone.length === 10) {
      try {
        const result = await authenticatePhone(phone);
        if (result.success) {
          // Update local user state
          verifyPhoneNumber(phone);
          
          // Check if user already has subscription
          if (result.user.subscription.isActive) {
            onSuccess();
            onClose();
            setStep("phone");
            setPhone("");
            return;
          }
        }
        setStep("subscription");
      } catch (error) {
        console.error('Phone authentication failed:', error);
      }
    }
  };

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    
    try {
      const result = await subscribeUser(phone, planId);
      if (result.success) {
        // Update local user state
        selectSubscription(planId as "weekly" | "monthly" | "3-month");
        
        setTimeout(() => {
          onSuccess();
          onClose();
          setStep("phone");
          setPhone("");
          setSelectedPlan("");
        }, 1000);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border-2 border-purple-600 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "phone" && (
          <div className="text-center">
            <div className="mb-6">
              <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Please login and subscribe
              </h2>
              <p className="text-gray-400">
                Unlock more interesting chapters with our affordable plans
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-center gap-4 text-sm">
                <span className="text-purple-400">Daily – ₹10</span>
                <span className="text-purple-400">Weekly – ₹20</span>
                <span className="text-purple-400">Monthly – ₹30</span>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-600 focus:outline-none"
                maxLength={10}
              />
            </div>

            <button
              onClick={handlePhoneSubmit}
              disabled={phone.length !== 10}
              className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === "subscription" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">
              Choose Your Plan
            </h2>

            <div className="space-y-3 mb-6">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan.id)}
                  className="w-full p-4 border-2 border-gray-600 rounded-lg hover:border-purple-600 transition-colors text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.duration}</p>
                    </div>
                    <div className="text-purple-400 font-bold text-xl">
                      {plan.price}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-gray-400 text-sm">
              Phone: {phone}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}