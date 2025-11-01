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
import { ArrowLeft, Church, Plus, Trash2, Upload, X } from "lucide-react";
import QRCode from "qrcode";
import { TablesInsert } from "@/integrations/supabase/types";
import { getUserFriendlyError } from "@/lib/errorHandler";
import MobileNav from "@/components/MobileNav";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  aadharNumber: z.string().regex(/^\d{12}$/, "Aadhar must be exactly 12 digits"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  upiId: z.string().min(3, "UPI ID is required").regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID format"),
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
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [upiId, setUpiId] = useState("");
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
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

    // Generate QR code for UPI
    const generateQRCode = async () => {
      const upiString = `upi://pay?pa=fhdjdnjdjjrjtn@okaxis&pn=Temple Membership&am=1000&cu=INR`;
      try {
        const url = await QRCode.toDataURL(upiString, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
    generateQRCode();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Aadhaar card file must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setAadharFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadharPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setAadharFile(null);
    setAadharPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setLoading(true);
    setIsSubmitting(true);

    try {
      const validation = applicationSchema.safeParse({
        fullName,
        address,
        phone,
        aadharNumber,
        pincode,
        city,
        state,
        upiId,
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

      if (!aadharFile) {
        toast({
          title: "Aadhaar Card Required",
          description: "Please upload your Aadhaar card",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Upload Aadhaar card file
      let aadharCardUrl = "";
      const fileExt = aadharFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('aadhaar-cards')
        .upload(fileName, aadharFile);

      if (uploadError) throw uploadError;

      // Store the file path instead of URL - signed URLs generated on-demand
      aadharCardUrl = fileName;

      const applicationData: TablesInsert<"membership_applications"> = {
        user_id: user.id,
        full_name: fullName,
        address,
        phone,
        aadhar_number: aadharNumber,
        pincode,
        city,
        state,
        upi_id: upiId,
        aadhar_card_url: aadharCardUrl,
        family_members: familyMembers as any,
        donation_amount: 1000,
        status: "pending",
      };

      const { error } = await supabase
        .from("membership_applications")
        .insert(applicationData);

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your membership application has been submitted successfully.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background pb-20 md:pb-0">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Church className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Membership Application
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl">
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

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="6-digit pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="Enter state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="aadharFile">Upload Aadhaar Card *</Label>
                {!aadharPreview ? (
                  <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="aadharFile"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="aadharFile"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload Aadhaar card (Max 5MB)
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Supports: JPG, PNG, PDF
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative border rounded-lg p-4 bg-muted/30">
                    <Button
                      type="button"
                      onClick={removeFile}
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    {aadharFile?.type.includes('pdf') ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">PDF</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{aadharFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(aadharFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={aadharPreview}
                        alt="Aadhaar preview"
                        className="w-full h-48 object-contain rounded"
                      />
                    )}
                  </div>
                )}
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

              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID *</Label>
                <Input
                  id="upiId"
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Enter your UPI ID for payment verification</p>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg border border-primary/20 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan the QR code to pay the membership fee
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-white p-4 rounded-lg">
                    {qrCodeUrl && (
                      <img 
                        src={qrCodeUrl} 
                        alt="UPI Payment QR Code" 
                        className="w-48 h-48"
                      />
                    )}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    UPI ID: fhdjdnjdjjrjtn@okaxis
                  </p>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">₹1,000</p>
                    <p className="text-sm text-muted-foreground">Membership Fee</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity h-12 text-lg"
                disabled={loading || isSubmitting}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </div>
  );
};

export default Apply;
