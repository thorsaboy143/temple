import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Church, Heart, Calendar, Shield, UserPlus, CheckCircle, Users, Star } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/5 to-background relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="glass border-b border-primary/10 sticky top-0 z-50 shadow-[var(--shadow-temple)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 temple-glow">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)]">
              <Church className="w-7 h-7 text-primary-foreground" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight gradient-text">Sacred Temple</h1>
          </div>
          <nav className="flex items-center space-x-3">
            <Button onClick={() => navigate("/events")} variant="ghost" size="sm" className="temple-glow">
              Events
            </Button>
            <Button onClick={() => navigate("/auth")} size="sm" className="shadow-[var(--shadow-glow)] temple-glow">
              Get Started
            </Button>
            <Button onClick={() => navigate("/admin/login")} variant="outline" size="sm" className="border-primary/30">
              Admin
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center animate-fade-in-up relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="relative inline-block mb-8 temple-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-[2rem] blur-2xl opacity-40 animate-glow-pulse" />
            <div className="relative w-28 h-28 mx-auto rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)] border-2 border-primary-glow/30">
              <Church className="w-16 h-16 text-primary-foreground drop-shadow-lg" strokeWidth={2} />
            </div>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-semibold tracking-tight leading-tight">
            <span className="text-foreground">Welcome to Our</span>
            <span className="block gradient-text mt-2">Community</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed tracking-wide">
            🙏 Join our spiritual family and experience the divine blessings of temple membership
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12">
            <Button onClick={() => navigate("/auth")} size="lg" className="shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-temple)] transition-all text-lg px-10 h-14 temple-glow">
              <Heart className="w-5 h-5 mr-2" />
              Sign Up
            </Button>
            <Button onClick={() => navigate("/auth")} variant="outline" size="lg" className="text-lg px-10 h-14 border-primary/30 hover:bg-primary/5">
              Login
            </Button>
            <Button onClick={() => navigate("/donate")} variant="secondary" size="lg" className="text-lg px-10 h-14 temple-glow">
              <Heart className="w-5 h-5 mr-2" />
              Donate
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 animate-fade-in relative z-10" style={{
      animationDelay: '0.2s'
    }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-5xl font-semibold text-center mb-20 tracking-tight gradient-text">
            Temple Membership Benefits
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-10 hover:shadow-[var(--shadow-temple)] transition-all duration-500 rounded-3xl border-primary/10 temple-glow bg-gradient-to-br from-card to-primary/5">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-[var(--shadow-glow)]">
                <UserPlus className="w-10 h-10 text-primary" strokeWidth={1.8} />
              </div>
              <CardTitle className="mb-4 text-2xl font-semibold tracking-tight">Easy Registration</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Simple and quick membership application process with instant updates
              </CardDescription>
            </Card>
            
            <Card className="text-center p-10 hover:shadow-[var(--shadow-temple)] transition-all duration-500 rounded-3xl border-primary/10 temple-glow bg-gradient-to-br from-card to-accent/5">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-[var(--shadow-glow)]">
                <CheckCircle className="w-10 h-10 text-primary" strokeWidth={1.8} />
              </div>
              <CardTitle className="mb-4 text-2xl font-semibold tracking-tight">Quick Approval</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Fast processing and approval of your membership application
              </CardDescription>
            </Card>
            
            <Card className="text-center p-10 hover:shadow-[var(--shadow-temple)] transition-all duration-500 rounded-3xl border-primary/10 temple-glow bg-gradient-to-br from-card to-primary/5">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Shield className="w-10 h-10 text-primary" strokeWidth={1.8} />
              </div>
              <CardTitle className="mb-4 text-2xl font-semibold tracking-tight">Secure Platform</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Your data is protected with enterprise-grade security measures
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-24 animate-fade-in relative z-10" style={{
      animationDelay: '0.4s'
    }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-5xl font-semibold text-center mb-20 tracking-tight gradient-text">
            What You'll Receive
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4 p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-500 border border-transparent hover:border-primary/20 temple-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Calendar className="w-7 h-7 text-primary" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 tracking-tight">Access to Events</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Participate in all temple events, festivals, and spiritual gatherings
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-500 border border-transparent hover:border-primary/20 temple-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Star className="w-7 h-7 text-primary" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 tracking-tight">Priority Booking</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Get priority access for special pujas and ceremonies
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-500 border border-transparent hover:border-primary/20 temple-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Heart className="w-7 h-7 text-primary" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 tracking-tight">Divine Blessings</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Receive regular updates on temple activities and blessings
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-500 border border-transparent hover:border-primary/20 temple-glow">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Users className="w-7 h-7 text-primary" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 tracking-tight">Community</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Be part of a vibrant spiritual community and network
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-10 mt-24 relative z-10 glass">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Church className="w-5 h-5 text-primary-foreground" strokeWidth={1.8} />
            </div>
            <span className="font-semibold gradient-text">Sacred Temple</span>
          </div>
          <p className="text-sm text-muted-foreground">&copy; 2024 Temple Membership. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default Index;