import { useState } from 'react';
import { X } from 'lucide-react';

interface SubscriptionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phone: string, plan: string) => void;
}

export default function SubscriptionPopup({ isOpen, onClose, onSuccess }: SubscriptionPopupProps) {
  const [step, setStep] = useState<'login' | 'subscription'>('login');
  const [phone, setPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('daily');
  const [loading, setLoading] = useState(false);

  const plans = [
    { id: 'daily', name: 'Daily', price: '₹10', duration: '1 day' },
    { id: 'weekly', name: 'Weekly', price: '₹20', duration: '7 days' },
    { id: 'monthly', name: 'Monthly', price: '₹30', duration: '30 days' }
  ];

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setStep('subscription');
    }
  };

  const handleSubscription = async () => {
    setLoading(true);
    try {
      // Call backend to store subscription
      const response = await fetch('https://velvetwords-backend.vercel.app/api/subscription/simple-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: phone, 
          planType: selectedPlan 
        })
      });
      
      if (response.ok) {
        console.log('Subscription stored in backend');
      }
      
      // Continue with frontend logic
      onSuccess(phone, selectedPlan);
      onClose();
    } catch (error) {
      console.error('Subscription failed:', error);
      // Still proceed with frontend subscription
      onSuccess(phone, selectedPlan);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#050505] rounded-xl border border-purple-600 shadow-[0_0_30px_rgba(124,58,237,0.3)] max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {step === 'login' ? 'Login Required' : 'Choose Subscription'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {step === 'login' ? (
          <div>
            <p className="text-gray-300 mb-6 text-center">
              Login & subscribe to unlock more interesting chapters
            </p>
            
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit phone number"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={phone.length !== 10}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Continue
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 mb-6 text-center">
              Select a subscription plan to continue reading
            </p>
            
            <div className="space-y-3 mb-6">
              {plans.map((plan) => (
                <label
                  key={plan.id}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-purple-600 bg-purple-600/20'
                      : 'border-gray-600 hover:border-purple-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={selectedPlan === plan.id}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{plan.name}</div>
                      <div className="text-gray-400 text-sm">{plan.duration}</div>
                    </div>
                    <div className="text-purple-400 font-bold text-lg">{plan.price}</div>
                  </div>
                </label>
              ))}
            </div>
            
            <button
              onClick={handleSubscription}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading ? 'Processing...' : `Subscribe for ${plans.find(p => p.id === selectedPlan)?.price}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}