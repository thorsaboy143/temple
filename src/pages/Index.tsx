import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Church, Users, FileCheck, Shield, Heart, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-apple-md">
              <Church className="w-6 h-6 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">
              Temple Membership
            </h1>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/events")}
              variant="ghost"
              className="hidden sm:flex"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              className="shadow-apple-sm"
            >
              Get Started
            </Button>
            <Button
              onClick={() => navigate("/admin/login")}
              variant="ghost"
              size="icon"
            >
              <Shield className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20 space-y-24">
        <section className="text-center space-y-8 max-w-3xl mx-auto animate-fade-in-up">
          <div className="w-20 h-20 bg-primary rounded-[1.75rem] flex items-center justify-center mx-auto shadow-apple-lg">
            <Church className="w-11 h-11 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-foreground tracking-tight leading-tight">
            Welcome to Our<br />Temple Community
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
            Join our sacred temple community and become part of a spiritual journey. 
            Register as a member and receive exclusive benefits and blessings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={() => navigate("/auth?mode=signup")}
              size="lg"
              className="h-12 px-8 text-base font-medium shadow-apple-md"
            >
              Sign Up
            </Button>
            <Button
              onClick={() => navigate("/auth?mode=login")}
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base font-medium"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/donate")}
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base font-medium"
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate Now
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-3xl border border-border shadow-apple-sm hover:shadow-apple-md transition-all space-y-4 animate-fade-in">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Easy Registration</h3>
            <p className="text-muted-foreground leading-relaxed font-light">
              Simple and secure membership registration process with email verification
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-apple-sm hover:shadow-apple-md transition-all space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <FileCheck className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Quick Approval</h3>
            <p className="text-muted-foreground leading-relaxed font-light">
              Track your application status and receive instant confirmation upon approval
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-apple-sm hover:shadow-apple-md transition-all space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Secure Platform</h3>
            <p className="text-muted-foreground leading-relaxed font-light">
              Your personal information is protected with enterprise-grade security
            </p>
          </div>
        </section>

        <section className="bg-card p-10 md:p-14 rounded-3xl border border-border shadow-apple-md max-w-4xl mx-auto">
          <h3 className="text-3xl font-semibold text-center mb-10 text-foreground">
            Membership Benefits
          </h3>
          <ul className="space-y-5 text-base">
            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Church className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-foreground leading-relaxed pt-2">Access to all temple events and ceremonies</span>
            </li>
            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Church className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-foreground leading-relaxed pt-2">Priority booking for special poojas and rituals</span>
            </li>
            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Church className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-foreground leading-relaxed pt-2">Receive prasad and spiritual blessings</span>
            </li>
            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Church className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-foreground leading-relaxed pt-2">Be part of a sacred spiritual community</span>
            </li>
          </ul>
        </section>
      </main>

      <footer className="glass border-t border-border/50 py-8 mt-24">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm font-light">
          <p>© 2025 Temple Membership. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
