import React, { useState } from 'react';
import { X, Phone, CreditCard, Check } from 'lucide-react';

const SubscriptionPopup = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Login, 2: Plans, 3: Payment
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const plans = [
    { id: 'daily', name: 'Daily', price: 10, duration: '1 Day' },
    { id: 'weekly', name: 'Weekly', price: 20, duration: '7 Days' },
    { id: 'monthly', name: 'Monthly', price: 30, duration: '30 Days' }
  ];

  const validatePhone = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const handlePhoneSubmit = async () => {
    if (!validatePhone(phoneNumber)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/subscription/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();
      
      if (data.success) {
        // Store phone number for API calls
        localStorage.setItem('userPhone', phoneNumber);
        
        if (data.user.hasActiveSubscription) {
          // User already has subscription, close popup
          onSuccess();
          onClose();
        } else {
          // Move to plan selection
          setStep(2);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (planId) => {
    setSelectedPlan(planId);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/subscription/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, planType: planId })
      });

      const data = await response.json();
      
      if (data.success) {
        // Simulate payment gateway redirect
        setStep(3);
        
        // Simulate payment success after 2 seconds (replace with real payment gateway)
        setTimeout(() => {
          handlePaymentSuccess(data.subscription.id);
        }, 2000);
      }
    } catch (error) {
      console.error('Subscription creation failed:', error);
      alert('Failed to create subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (subscriptionId) => {
    try {
      const response = await fetch('http://localhost:5001/api/subscription/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptionId, 
          paymentId: 'pay_' + Date.now() // Mock payment ID
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Payment confirmation failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Phone Login */}
        {step === 1 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Login and Subscribe
            </h2>
            <p className="text-gray-600 mb-6">
              Unlock more interesting chapters with our subscription plans
            </p>

            <div className="space-y-4">
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={10}
              />

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">Daily</div>
                  <div className="text-purple-600">₹10</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">Weekly</div>
                  <div className="text-purple-600">₹20</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">Monthly</div>
                  <div className="text-purple-600">₹30</div>
                </div>
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={loading || !phoneNumber}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Plan Selection */}
        {step === 2 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Choose Your Plan
            </h2>
            <p className="text-gray-600 mb-6">
              Select a subscription plan to unlock all chapters
            </p>

            <div className="space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={loading}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{plan.name}</div>
                      <div className="text-sm text-gray-600">{plan.duration}</div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">₹{plan.price}</div>
                  </div>
                </button>
              ))}
            </div>

            {loading && (
              <div className="mt-4 text-center text-gray-600">
                Creating subscription...
              </div>
            )}
          </div>
        )}

        {/* Step 3: Payment Processing */}
        {step === 3 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600 mb-6">
              Please wait while we process your payment...
            </p>
            
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPopup;