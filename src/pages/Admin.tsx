import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Church, X, LogOut, Filter, FileText, Search, Edit, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
import { getUserFriendlyError } from "@/lib/errorHandler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Application = Tables<"membership_applications">;

const Admin = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchName, setSearchName] = useState("");
  const [searchAadhar, setSearchAadhar] = useState("");
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const filteredApplications = applications.filter((app) => {
    // Filter by status
    if (filterStatus !== "all" && app.status !== filterStatus) {
      return false;
    }
    
    // Filter by name
    if (searchName && !app.full_name.toLowerCase().includes(searchName.toLowerCase())) {
      return false;
    }
    
    // Filter by Aadhar number
    if (searchAadhar && !app.aadhar_number.includes(searchAadhar)) {
      return false;
    }
    
    return true;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

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
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: getUserFriendlyError(error),
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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button onClick={() => navigate("/dashboard")} variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Church className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="icon">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-[var(--shadow-temple)]">
          <CardHeader>
            <CardTitle className="text-2xl">Membership Applications</CardTitle>
            <CardDescription>Review and manage temple membership applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={filterStatus} onValueChange={setFilterStatus} className="mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mb-6 p-4 bg-muted/50 rounded-lg border space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Search Applications</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="searchName">Search by Name</Label>
                  <Input
                    id="searchName"
                    type="text"
                    placeholder="Enter applicant name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="searchAadhar">Search by Aadhar Number</Label>
                  <Input
                    id="searchAadhar"
                    type="text"
                    placeholder="Enter Aadhar number..."
                    value={searchAadhar}
                    onChange={(e) => setSearchAadhar(e.target.value)}
                    maxLength={12}
                    className="w-full"
                  />
                </div>
              </div>
              {(searchName || searchAadhar) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchName("");
                    setSearchAadhar("");
                  }}
                >
                  Clear Search
                </Button>
              )}
            </div>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No {filterStatus !== "all" ? filterStatus : ""} applications found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
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
                            {app.upi_id && <p><strong>UPI ID:</strong> {app.upi_id}</p>}
                            <p><strong>Address:</strong> {app.address}, {app.city}, {app.state} - {app.pincode}</p>
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
                      {app.status === "approved" && (
                        <div className="flex space-x-3 pt-4 border-t">
                          <Button
                            onClick={() => navigate(`/admin/edit-member?id=${app.id}`)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Details
                          </Button>
                          {app.member_id && (
                            <Button
                              onClick={() => navigate(`/member-card?id=${app.id}`)}
                              variant="outline"
                              className="flex-1"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              View Card
                            </Button>
                          )}
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
