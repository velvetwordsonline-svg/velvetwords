import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Categories from "./pages/Categories";
import Account from "./pages/Account";
import Search from "./pages/Search";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ContentDisclaimer from "./pages/ContentDisclaimer";
import PaymentPolicy from "./pages/PaymentPolicy";
import CancellationRefund from "./pages/CancellationRefund";
import Contact from "./pages/Contact";
import StoryDetail from "./pages/StoryDetail";
import Reader from "./pages/Reader";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/library" element={<Library />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/account" element={<Account />} />
              <Route path="/search" element={<Search />} />
              <Route path="/story/:id" element={<StoryDetail />} />
              <Route path="/reader/:storyId" element={<Reader />} />
              <Route path="/reader/:storyId/:chapterId" element={<Reader />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/content-disclaimer" element={<ContentDisclaimer />} />
              <Route path="/payment-policy" element={<PaymentPolicy />} />
              <Route path="/cancellation-refund" element={<CancellationRefund />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Navigate to="https://www.velvetwords.online/admin" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </QueryClientProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
