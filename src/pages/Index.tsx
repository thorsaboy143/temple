import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Church, Users, FileCheck, Shield, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-[var(--shadow-temple)]">
              <Church className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Temple Membership
            </h1>
          </div>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 space-y-16">
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto shadow-[var(--shadow-temple)] animate-pulse">
            <Church className="w-14 h-14 text-primary-foreground" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Our Temple Community
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Join our sacred temple community and become part of a spiritual journey. 
            Register as a member and receive exclusive benefits and blessings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg px-8 py-6 shadow-[var(--shadow-temple)]"
            >
              Join Now - ₹1,000
            </Button>
            <Button
              onClick={() => navigate("/donate")}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-primary hover:bg-primary/10"
            >
              <Heart className="w-5 h-5 mr-2" />
              Donate Now
            </Button>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-lg border-2 border-primary/20 shadow-[var(--shadow-temple)] hover:shadow-xl transition-shadow space-y-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Easy Registration</h3>
            <p className="text-muted-foreground">
              Simple and secure membership registration process with email verification
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border-2 border-primary/20 shadow-[var(--shadow-temple)] hover:shadow-xl transition-shadow space-y-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <FileCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Quick Approval</h3>
            <p className="text-muted-foreground">
              Track your application status and receive instant confirmation upon approval
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border-2 border-primary/20 shadow-[var(--shadow-temple)] hover:shadow-xl transition-shadow space-y-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Secure Platform</h3>
            <p className="text-muted-foreground">
              Your personal information is protected with enterprise-grade security
            </p>
          </div>
        </section>

        <section className="bg-card p-8 md:p-12 rounded-lg border-2 border-primary/20 shadow-[var(--shadow-temple)] max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Membership Benefits
          </h3>
          <ul className="space-y-4 text-lg text-muted-foreground">
            <li className="flex items-start space-x-3">
              <Church className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <span>Access to all temple events and ceremonies</span>
            </li>
            <li className="flex items-start space-x-3">
              <Church className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <span>Priority booking for special poojas and rituals</span>
            </li>
            <li className="flex items-start space-x-3">
              <Church className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <span>Receive prasad and spiritual blessings</span>
            </li>
            <li className="flex items-start space-x-3">
              <Church className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <span>Be part of a sacred spiritual community</span>
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t bg-card/50 backdrop-blur-sm py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Temple Membership. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
