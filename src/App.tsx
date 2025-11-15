import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatedLayout } from "@/components/AnimatedLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Apply from "./pages/Apply";
import Donate from "./pages/Donate";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import PaymentDetails from "./pages/PaymentDetails";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import MemberCard from "./pages/MemberCard";
import AdminEditMember from "./pages/AdminEditMember";
import NotFound from "./pages/NotFound";
import ThankYou from "./pages/ThankYou";
import VerifyEmail from "./pages/VerifyEmail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={
            <AnimatedLayout>
              <Auth />
            </AnimatedLayout>
          } />
          <Route path="/dashboard" element={
            <AnimatedLayout>
              <Dashboard />
            </AnimatedLayout>
          } />
          <Route path="/apply" element={
            <AnimatedLayout>
              <Apply />
            </AnimatedLayout>
          } />
          <Route path="/donate" element={
            <AnimatedLayout>
              <Donate />
            </AnimatedLayout>
          } />
          <Route path="/events" element={
            <AnimatedLayout>
              <Events />
            </AnimatedLayout>
          } />
          <Route path="/profile" element={
            <AnimatedLayout>
              <Profile />
            </AnimatedLayout>
          } />
          <Route path="/payment-details" element={
            <AnimatedLayout>
              <PaymentDetails />
            </AnimatedLayout>
          } />
          <Route path="/admin" element={
            <AnimatedLayout>
              <Admin />
            </AnimatedLayout>
          } />
          <Route path="/admin/login" element={
            <AnimatedLayout>
              <AdminLogin />
            </AnimatedLayout>
          } />
          <Route path="/admin/edit-member" element={
            <AnimatedLayout>
              <AdminEditMember />
            </AnimatedLayout>
          } />
          <Route path="/member-card" element={
            <AnimatedLayout>
              <MemberCard />
            </AnimatedLayout>
          } />
          <Route path="/thank-you" element={
            <AnimatedLayout>
              <ThankYou />
            </AnimatedLayout>
          } />
          <Route path="/verify-email" element={
            <AnimatedLayout>
              <VerifyEmail />
            </AnimatedLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
