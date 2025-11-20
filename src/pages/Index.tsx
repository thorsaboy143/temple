import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Shield, LogIn } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-background to-secondary flex flex-col">
      {/* Clean Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">Sacred Temple</span>
          </div>
          <nav className="flex items-center space-x-2">
            <Button onClick={() => navigate("/events")} variant="ghost" size="sm" className="hidden sm:flex">
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </Button>
            <Button onClick={() => navigate("/donate")} variant="ghost" size="sm" className="hidden sm:flex">
              <Heart className="w-4 h-4 mr-2" />
              Donate
            </Button>
            <Button onClick={() => navigate("/admin/login")} variant="ghost" size="sm" className="hidden sm:flex">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl w-full text-center space-y-6">
          {/* Logo Circle */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Temple Membership (Updated Test)
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-light max-w-xl mx-auto">
              Join our community for exclusive access to events, ceremonies, and spiritual resources
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 px-8 h-12 text-lg font-medium shadow-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              size="lg"
              className="px-8 h-12 text-lg font-medium"
            >
              Member Login
            </Button>
          </div>

          {/* No stats or extra sections to ensure no scroll */}
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t py-6 bg-card/30">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Sacred Temple. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;