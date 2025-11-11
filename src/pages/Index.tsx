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
  <header className="glass border-b border-primary/10 sticky top-0 z-50 shadow-lg backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 temple-glow">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)] ring-2 ring-primary/20">
              <Church className="w-8 h-8 text-primary-foreground" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight gradient-text">Sacred Temple</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Discover Inner Peace</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Button onClick={() => navigate("/events")} variant="ghost" size="sm" className="temple-glow hidden sm:flex active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30">
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </Button>
            <Button onClick={() => navigate("/donate")} variant="ghost" size="sm" className="temple-glow hidden sm:flex active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30">
              <Heart className="w-4 h-4 mr-2" />
              Donate
            </Button>
            <Button onClick={() => navigate("/auth")} size="sm" className="shadow-[var(--shadow-glow)] temple-glow bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30">
              Get Started
            </Button>
            <Button onClick={() => navigate("/admin/login")} variant="outline" size="sm" className="border-primary/30 hidden sm:flex active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
  <section className="container mx-auto px-4 py-32 text-center motion-safe:animate-fade-in-up relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="relative inline-block mb-12 temple-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-[3rem] blur-3xl opacity-30 animate-glow-pulse" />
            <div className="relative w-36 h-36 mx-auto rounded-[3rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)] border-2 border-primary-glow/30 ring-4 ring-background">
              <Church className="w-20 h-20 text-primary-foreground drop-shadow-lg" strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
              <span className="text-foreground block">Embrace Spiritual</span>
              <span className="gradient-text block mt-2">Enlightenment</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed tracking-wide">
              Join our sacred community and embark on a journey of spiritual growth, mindfulness, and inner peace 🙏
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              onClick={() => navigate("/auth")} 
              size="lg" 
              className="shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-temple)] transition-all text-lg px-12 h-14 temple-glow bg-gradient-to-r from-primary to-accent text-primary-foreground group active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              <span className="mr-2 group-hover:scale-110 transition-transform">✨</span>
              Begin Your Journey
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
            <Button 
              onClick={() => navigate("/auth")} 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 h-14 border-primary/30 hover:bg-primary/5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Member Login
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-16 pt-8 border-t border-primary/10">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">1000+</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">50+</div>
              <div className="text-sm text-muted-foreground">Events Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-muted-foreground">Divine Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-32 motion-safe:animate-fade-in relative z-10" style={{
        animationDelay: '0.2s'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="text-sm font-semibold text-primary mb-4 tracking-wide">MEMBERSHIP PRIVILEGES</div>
            <h3 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Experience the<br/>
              <span className="gradient-text">Divine Benefits</span>
            </h3>
            <p className="text-lg text-muted-foreground">
              Unlock exclusive spiritual experiences and become part of our sacred community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group relative overflow-hidden p-8 hover:shadow-[var(--shadow-temple)] transition-all duration-500 rounded-3xl border-primary/10 active:scale-98 focus-within:shadow-[var(--shadow-temple)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)] ring-2 ring-primary/20 group-hover:scale-110 transition-transform active:scale-105 focus:scale-105">
                  <UserPlus className="w-8 h-8 text-primary-foreground" strokeWidth={1.8} />
                </div>
                <CardTitle className="mb-4 text-2xl font-bold tracking-tight">Instant Access</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Quick and seamless registration process with immediate access to member benefits and spiritual resources
                </CardDescription>
                <div className="mt-6 flex items-center text-sm text-primary font-medium group-hover:translate-x-2 transition-transform">
                  Learn more <span className="ml-2">→</span>
                </div>
              </div>
            </Card>
            
            <Card className="group relative overflow-hidden p-8 hover:shadow-[var(--shadow-temple)] transition-all duration-500 rounded-3xl border-primary/10 active:scale-98 focus-within:shadow-[var(--shadow-temple)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)] ring-2 ring-primary/20 group-hover:scale-110 transition-transform active:scale-105 focus:scale-105">
                  <CheckCircle className="w-8 h-8 text-primary-foreground" strokeWidth={1.8} />
                </div>
                <CardTitle className="mb-4 text-2xl font-bold tracking-tight">Priority Access</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Get exclusive access to special ceremonies, events, and spiritual gatherings throughout the year
                </CardDescription>
                <div className="mt-6 flex items-center text-sm text-primary font-medium group-hover:translate-x-2 transition-transform">
                  Learn more <span className="ml-2">→</span>
                </div>
              </div>
            </Card>
            
            <Card className="group relative overflow-hidden p-8 hover:shadow-[var(--shadow-temple)] transition-all duration-500 rounded-3xl border-primary/10 active:scale-98 focus-within:shadow-[var(--shadow-temple)]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)] ring-2 ring-primary/20 group-hover:scale-110 transition-transform active:scale-105 focus:scale-105">
                  <Shield className="w-8 h-8 text-primary-foreground" strokeWidth={1.8} />
                </div>
                <CardTitle className="mb-4 text-2xl font-bold tracking-tight">Divine Connect</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Stay connected with regular updates on auspicious dates, festivals, and spiritual guidance
                </CardDescription>
                <div className="mt-6 flex items-center text-sm text-primary font-medium group-hover:translate-x-2 transition-transform">
                  Learn more <span className="ml-2">→</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-32 motion-safe:animate-fade-in relative z-10" style={{
        animationDelay: '0.4s'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="text-sm font-semibold text-primary mb-4 tracking-wide">SPIRITUAL JOURNEY</div>
            <h3 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Embrace the<br/>
              <span className="gradient-text">Sacred Experience</span>
            </h3>
            <p className="text-lg text-muted-foreground">
              Discover the transformative power of our temple community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="group flex items-start space-x-6 p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-500 border border-transparent hover:border-primary/20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-primary/20 group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 tracking-tight">Sacred Events</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Access exclusive spiritual events, ceremonies, and festivals throughout the year. Experience divine connections with like-minded devotees.
                </p>
              </div>
            </div>
            
            <div className="group flex items-start space-x-6 p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-500 border border-transparent hover:border-primary/20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-primary/20 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 tracking-tight">VIP Access</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Enjoy priority booking for special pujas, prime seating during events, and exclusive access to spiritual leaders.
                </p>
              </div>
            </div>
            
            <div className="group flex items-start space-x-6 p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-500 border border-transparent hover:border-primary/20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-primary/20 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 tracking-tight">Divine Connect</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Stay blessed with regular updates on auspicious dates, spiritual guidance, and temple activities directly to your device.
                </p>
              </div>
            </div>
            
            <div className="group flex items-start space-x-6 p-8 rounded-3xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-500 border border-transparent hover:border-primary/20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-primary/20 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-primary-foreground" strokeWidth={1.8} />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3 tracking-tight">Community</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Join a thriving spiritual family, participate in community service, and build meaningful connections with fellow devotees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-32 motion-safe:animate-fade-in relative z-10" style={{
        animationDelay: '0.6s'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <div className="text-sm font-semibold text-primary mb-4 tracking-wide">MEMBER STORIES</div>
            <h3 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Hear from Our<br/>
              <span className="gradient-text">Blessed Community</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-[var(--shadow-temple)] transition-all duration-500 rounded-3xl border-primary/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Rajesh Kumar</h4>
                  <p className="text-sm text-muted-foreground">Member since 2023</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "Being part of this temple community has transformed my spiritual journey. The events and ceremonies have brought peace and purpose to my life."
              </p>
            </Card>

            <Card className="p-8 hover:shadow-[var(--shadow-temple)] transition-all duration-500 rounded-3xl border-primary/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Priya Sharma</h4>
                  <p className="text-sm text-muted-foreground">Member since 2024</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "The temple membership has given me access to amazing spiritual resources and a wonderful community. I feel blessed to be part of this family."
              </p>
            </Card>

            <Card className="p-8 hover:shadow-[var(--shadow-temple)] transition-all duration-500 rounded-3xl border-primary/10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Amit Patel</h4>
                  <p className="text-sm text-muted-foreground">Member since 2022</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "The priority access to ceremonies and special events has made my spiritual practice more meaningful. I'm grateful for this divine connection."
              </p>
            </Card>
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