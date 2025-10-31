import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Church, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";

type Application = Tables<"membership_applications">;

const Admin = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const hasAdminRole = roles?.some((role) => role.role === "admin");

      if (!hasAdminRole) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);

      const { data: apps } = await supabase
        .from("membership_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (apps) setApplications(apps);
      setLoading(false);
    };

    checkAdminAndFetch();
  }, [navigate, toast]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("membership_applications")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setApplications(applications.map((app) =>
        app.id === id ? { ...app, status } : app
      ));

      toast({
        title: "Status Updated",
        description: `Application ${status} successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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

  if (!isAdmin) return null;

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
        <div className="container mx-auto px-4 py-4 flex items-center space-x-3">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Church className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Card className="shadow-[var(--shadow-temple)]">
          <CardHeader>
            <CardTitle className="text-2xl">Membership Applications</CardTitle>
            <CardDescription>Review and manage temple membership applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No applications yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id} className="border-2">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-semibold">{app.full_name}</h3>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="grid gap-2 text-sm text-muted-foreground">
                            <p><strong>Phone:</strong> {app.phone}</p>
                            <p><strong>Aadhar:</strong> {app.aadhar_number}</p>
                            <p><strong>Address:</strong> {app.address}</p>
                            <p><strong>Donation:</strong> ₹{app.donation_amount}</p>
                            <p><strong>Submitted:</strong> {new Date(app.created_at).toLocaleString()}</p>
                          </div>
                          {app.family_members && Array.isArray(app.family_members) && app.family_members.length > 0 && (
                            <div className="pt-2">
                              <strong className="text-sm">Family Members:</strong>
                              <div className="mt-2 space-y-1">
                                {app.family_members.map((member: any, idx: number) => (
                                  <p key={idx} className="text-sm text-muted-foreground">
                                    {member.name} ({member.age} yrs, {member.relation})
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {app.status === "pending" && (
                        <div className="flex space-x-3 pt-4 border-t">
                          <Button
                            onClick={() => updateStatus(app.id, "approved")}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => updateStatus(app.id, "rejected")}
                            variant="destructive"
                            className="flex-1"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
