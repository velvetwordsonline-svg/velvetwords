import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  duration: string;
  active: boolean;
  badge?: string;
}

interface AdminSubscriptionPlanModalProps {
  isOpen: boolean;
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSave: (plan: SubscriptionPlan) => void;
}

export default function AdminSubscriptionPlanModal({
  isOpen,
  plan,
  onClose,
  onSave,
}: AdminSubscriptionPlanModalProps) {
  const [formData, setFormData] = useState<SubscriptionPlan>(
    plan || {
      id: "",
      name: "",
      price: "",
      duration: "",
      active: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) {
      alert("Please fill in all required fields");
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card border-[3px] border-primary rounded-lg max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Edit Plan: {plan.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">
              Plan Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Monthly Plan"
              className="bg-white/5 border-white/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Price *
              </label>
              <Input
                type="text"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="$9.99"
                className="bg-white/5 border-white/20"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Duration *
              </label>
              <Input
                type="text"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="30 days"
                className="bg-white/5 border-white/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">
              Badge (Optional)
            </label>
            <Input
              type="text"
              value={formData.badge || ""}
              onChange={(e) =>
                setFormData({ ...formData, badge: e.target.value || undefined })
              }
              placeholder="e.g., Popular, Best Value"
              className="bg-white/5 border-white/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="w-5 h-5"
              />
              <span className="text-white font-semibold">Active</span>
            </label>
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

