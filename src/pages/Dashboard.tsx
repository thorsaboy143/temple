import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Church, FileText, LogOut, Settings, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserRole {
  role: string;
}

interface MembershipApplication {
  id: string;
  full_name: string;
  status: string;
  created_at: string;
  donation_amount: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Church className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card className="shadow-[var(--shadow-temple)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Welcome, {user?.user_metadata?.full_name || user?.email}</CardTitle>
                <CardDescription>Manage your temple membership</CardDescription>
              </div>
              {isAdmin && (
                <Badge className="bg-gradient-to-r from-primary to-secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button
              onClick={() => navigate("/apply")}
              className="h-24 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              <div className="flex flex-col items-center space-y-2">
                <FileText className="w-8 h-8" />
                <span className="text-lg">Apply for Membership</span>
              </div>
            </Button>
            {isAdmin && (
              <Button
                onClick={() => navigate("/admin")}
                className="h-24 bg-card border-2 border-primary text-foreground hover:bg-muted"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Settings className="w-8 h-8 text-primary" />
                  <span className="text-lg">Admin Panel</span>
                </div>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-temple)]">
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>Track your membership application status</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No applications yet. Apply for membership to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{app.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Donation: ₹{app.donation_amount}
                      </p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
