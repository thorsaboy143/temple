import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { ArrowLeft, Church, Plus, Trash2 } from "lucide-react";
import { TablesInsert } from "@/integrations/supabase/types";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  aadharNumber: z.string().regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
});

interface FamilyMember {
  name: string;
  age: string;
  relation: string;
}

const Apply = () => {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setFullName(session.user.user_metadata?.full_name || "");
        setPhone(session.user.user_metadata?.phone || "");
      }
    });
  }, [navigate]);

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: "", age: "", relation: "" }]);
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...familyMembers];
    updated[index][field] = value;
    setFamilyMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = applicationSchema.safeParse({
        fullName,
        address,
        phone,
        aadharNumber,
      });

      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const applicationData: TablesInsert<"membership_applications"> = {
        user_id: user.id,
        full_name: fullName,
        address,
        phone,
        aadhar_number: aadharNumber,
        family_members: familyMembers as any,
        donation_amount: 1000,
        status: "pending",
      };

      const { data: newApplication, error } = await supabase
        .from("membership_applications")
        .insert(applicationData)
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email
      try {
        await supabase.functions.invoke("send-membership-confirmation", {
          body: {
            email: user.email,
            fullName: fullName,
            donationAmount: 1000,
            applicationId: newApplication.id,
          },
        });
        console.log("Confirmation email sent successfully");
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the whole operation if email fails
      }

      toast({
        title: "Application Submitted!",
        description: "Your membership application has been submitted successfully. You'll receive a confirmation email shortly.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            Membership Application
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-[var(--shadow-temple)]">
          <CardHeader>
            <CardTitle className="text-2xl">Temple Membership Form</CardTitle>
            <CardDescription>
              Fill in your details to become a temple member. Membership fee: ₹1,000
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Card Number *</Label>
                <Input
                  id="aadhar"
                  type="text"
                  placeholder="Enter 12-digit Aadhar number"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  maxLength={12}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Family Members (Optional)</Label>
                  <Button
                    type="button"
                    onClick={addFamilyMember}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>

                {familyMembers.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Member {index + 1}</Label>
                      <Button
                        type="button"
                        onClick={() => removeFamilyMember(index)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <Input
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => updateFamilyMember(index, "name", e.target.value)}
                      />
                      <Input
                        placeholder="Age"
                        type="number"
                        value={member.age}
                        onChange={(e) => updateFamilyMember(index, "age", e.target.value)}
                      />
                      <Input
                        placeholder="Relation"
                        value={member.relation}
                        onChange={(e) => updateFamilyMember(index, "relation", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Membership Fee</span>
                  <span className="text-2xl font-bold text-primary">₹1,000</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity h-12 text-lg"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Apply;
