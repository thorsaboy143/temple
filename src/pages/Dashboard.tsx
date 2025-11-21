import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Church, FileText, LogOut, Settings, Shield, Heart, Calendar, User, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MobileNav from "@/components/MobileNav";

interface UserRole {
  role: string;
}

interface MembershipApplication {
  id: string;
  full_name: string;
  status: string;
  created_at: string;
  donation_amount: number;
  member_id: string | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isAdmin = userRoles.some((role) => role.role === "admin");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (roles) setUserRoles(roles);

      const { data: apps } = await supabase
        .from("membership_applications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (apps) setApplications(apps);

      setLoading(false);
    };

    fetchUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Church className="w-16 h-16 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/5 to-background pb-20 md:pb-0 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-[100px]" />
      </div>

      <header className="border-b glass border-primary/10 sticky top-0 z-50 shadow-[var(--shadow-temple)]">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <Church className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" strokeWidth={1.8} />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold gradient-text tracking-tight">
              Dashboard
            </h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="border-primary/30">
            <LogOut className="w-4 h-4 mr-2 md:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8 relative z-10">
        <Card className="shadow-[var(--shadow-temple)] border-primary/10 rounded-3xl temple-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl tracking-tight">Welcome, {user?.user_metadata?.full_name || user?.email}</CardTitle>
                <CardDescription>Manage your temple membership</CardDescription>
              </div>
              {isAdmin && (
                <Badge className="bg-gradient-to-r from-primary to-accent shadow-lg">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button
              onClick={() => navigate("/apply")}
              className="h-24 bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-all shadow-[var(--shadow-glow)] temple-glow rounded-2xl"
            >
              <div className="flex flex-col items-center space-y-2">
                <FileText className="w-8 h-8" />
                <span className="text-lg font-semibold">Apply for Membership</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/donate")}
              className="h-24 bg-gradient-to-br from-accent to-primary hover:opacity-90 transition-all shadow-[var(--shadow-glow)] temple-glow rounded-2xl"
            >
              <div className="flex flex-col items-center space-y-2">
                <Heart className="w-8 h-8" />
                <span className="text-lg font-semibold">Make a Donation</span>
              </div>
            </Button>
            {isAdmin && (
              <Button
                onClick={() => navigate("/admin")}
                className="h-24 bg-card border-2 border-primary/30 text-foreground hover:bg-primary/5 md:col-span-2 rounded-2xl temple-glow"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Settings className="w-8 h-8 text-primary" />
                  <span className="text-lg font-semibold">Admin Panel</span>
                </div>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-temple)] border-primary/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">Your Applications</CardTitle>
            <CardDescription>Track your membership application status</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-primary opacity-50" />
                </div>
                <p className="text-lg">No applications yet. Apply for membership to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 border border-primary/10 rounded-2xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all duration-500 space-y-3 temple-glow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold text-lg tracking-tight">{app.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Donation: ₹{app.donation_amount}
                        </p>
                        {app.member_id && (
                          <p className="text-sm font-semibold gradient-text">
                            Member ID: {app.member_id}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                    {app.status === "approved" && app.member_id && (
                      <Button
                        onClick={() => navigate(`/member-card?id=${app.id}`)}
                        variant="outline"
                        size="sm"
                        className="w-full border-primary/30 temple-glow"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        View Member Card
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </div>
  );
};

export default Dashboard;
