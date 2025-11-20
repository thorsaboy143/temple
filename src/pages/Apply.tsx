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
import { ArrowLeft, Church, Plus, Trash2, Upload, X, CheckCircle, XCircle } from "lucide-react";
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
  // Photo validation will be handled separately since it's a file
});

interface FamilyMember {
  name: string;
  age: string;
  relation: string;
}

interface SimpleAppRow {
  id: string;
  user_id: string;
}

interface ApplicationRecord {
  id: string;
  user_id: string;
  full_name?: string;
  address?: string;
  phone?: string;
  aadhar_number?: string;
  pincode?: string;
  city?: string;
  state?: string;
  upi_id?: string;
  family_members?: FamilyMember[];
  aadhar_card_url?: string;
  passport_photo_url?: string;
  created_at?: string;
}

interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
  };
}

const Apply = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [aadharStatus, setAadharStatus] = useState<'unknown' | 'checking' | 'available' | 'taken'>('unknown');
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  // UPI removed from form
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [passportPhotoPreview, setPassportPhotoPreview] = useState<string | null>(null);
  const [existingApplicationId, setExistingApplicationId] = useState<string | null>(null);
  const [existingAadharPath, setExistingAadharPath] = useState<string | null>(null);
  const [existingPhotoPath, setExistingPhotoPath] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

        // After we have user session, check if they already have an application for this user
        (async (userId: string) => {
          try {
            const { data: existing, error } = await supabase
              .from("membership_applications")
              .select("*")
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(1);

            if (error) throw error;

            const app = Array.isArray(existing) && existing.length ? existing[0] : null;
            if (app) {
              const typed = app as unknown as ApplicationRecord;
              // Prefill form fields
              setExistingApplicationId(typed.id);
              setFullName(typed.full_name || "");
              setAddress(typed.address || "");
              setPhone(typed.phone || "");
              setAadharNumber(typed.aadhar_number || "");
              setPincode(typed.pincode || "");
              setCity(typed.city || "");
              setState(typed.state || "");
              // upi_id removed from form
              setFamilyMembers(typed.family_members || []);

              const aadharPath = typed.aadhar_card_url || null;
              if (aadharPath) {
                setExistingAadharPath(aadharPath);
                // Try to generate a signed URL for preview (short lived)
                try {
                  const { data: signedData, error: signedError } = await supabase.storage
                    .from("aadhaar-cards")
                    .createSignedUrl(aadharPath, 60);
                  if (!signedError && signedData?.signedUrl) {
                    setAadharPreview(signedData.signedUrl as string);
                  } else {
                    // fallback to public URL
                    const { data: publicData } = supabase.storage.from("aadhaar-cards").getPublicUrl(aadharPath);
                    if (publicData?.publicUrl) setAadharPreview(publicData.publicUrl);
                  }
                } catch (err) {
                  console.warn("Could not get signed URL for aadhar preview", err);
                }
              }

              // Load existing passport photo preview if present
              const photoPath = typed.passport_photo_url || null;
              if (photoPath) {
                setExistingPhotoPath(photoPath);
                try {
                  const { data: signedData, error: signedError } = await supabase.storage
                    .from("passport-photos")
                    .createSignedUrl(photoPath, 60);
                  if (!signedError && signedData?.signedUrl) {
                    setPassportPhotoPreview(signedData.signedUrl as string);
                  } else {
                    // fallback to public URL if bucket is public
                    const { data: publicData } = supabase.storage.from("passport-photos").getPublicUrl(photoPath);
                    if (publicData?.publicUrl) setPassportPhotoPreview(publicData.publicUrl);
                  }
                } catch (err) {
                  console.warn("Could not get signed URL for passport photo preview", err);
                }
              }
            }
          } catch (err) {
            console.error("Error fetching existing application:", err);
          }
        })(session.user.id);
      }
    });

    // (removed UPI/QR code generation - payment is no longer collected on this form)
  }, [navigate]);

  // Debounced live Aadhaar availability check using server-side RPC
  useEffect(() => {
    setAadharStatus('unknown');

    if (!aadharNumber || aadharNumber.length !== 12 || !/^\d{12}$/.test(aadharNumber)) {
      // invalid length or empty, don't check
      return;
    }

    let mounted = true;
    setAadharStatus('checking');
    const timer = setTimeout(async () => {
      try {
        // Call Postgres RPC function created by migration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('check_aadhar_unique', { aadhar_text: aadharNumber, current_user_id: user?.id || null });
        if (error) {
          console.warn('RPC check_aadhar_unique error:', error);
          // If RPC isn't found, show a helpful toast to the developer/admin
            let errMsg = String(error);
            if (error instanceof Error) errMsg = error.message;
            else if (error && typeof error === 'object' && 'message' in error) {
              const m = (error as {message?: unknown}).message;
              if (typeof m === 'string') errMsg = m;
            }
            if (errMsg.includes('Could not find the function') || errMsg.includes('PGRST202') || errMsg.includes('404')) {
            toast({
              title: 'Server function missing',
              description: 'A server-side function check_aadhar_unique is not installed. Run the DB migration or create the RPC in Supabase SQL editor.',
              variant: 'destructive',
            });
          }
          if (mounted) setAadharStatus('unknown');
          return;
        }

        // data will be boolean true/false
        if (mounted) setAadharStatus(data ? 'available' : 'taken');
      } catch (err) {
        console.error('Error running Aadhaar RPC:', err);
        if (mounted) setAadharStatus('unknown');
      }
    }, 600); // debounce

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [aadharNumber, user, toast]);

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
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Aadhaar card file must be less than 5MB",
          variant: "destructive",
        });
        e.target.value = ''; // Clear the input
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or PDF file",
          variant: "destructive",
        });
        e.target.value = ''; // Clear the input
        return;
      }

      try {
        setAadharFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setAadharPreview(reader.result as string);
        };
        reader.onerror = () => {
          toast({
            title: "File read error",
            description: "Please try uploading the file again",
            variant: "destructive",
          });
          setAadharFile(null);
          setAadharPreview(null);
          e.target.value = ''; // Clear the input
        };
        reader.readAsDataURL(file);
      } catch (error) {
        toast({
          title: "File upload error",
          description: "Please try uploading the file again",
          variant: "destructive",
        });
        e.target.value = ''; // Clear the input
      }
    }
  };

  const handlePassportPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clear previous error states
      setPassportPhoto(null);
      setPassportPhotoPreview(null);
      
      // Check file size (5MB limit like Aadhaar)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Passport photo must be less than 5MB",
          variant: "destructive",
        });
        e.target.value = ''; // Clear the input
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, or PDF file",
          variant: "destructive",
        });
        e.target.value = ''; // Clear the input
        return;
      }

      try {
        // Simple file reader to create preview
        const reader = new FileReader();
        
        reader.onloadend = () => {
          // If validation passes, set the file and preview
          setPassportPhoto(file);
          setPassportPhotoPreview(reader.result as string);
        };

        reader.onerror = () => {
          toast({
            title: "File read error",
            description: "Failed to read the image file. Please try again.",
            variant: "destructive",
          });
          e.target.value = '';
          setPassportPhoto(null);
          setPassportPhotoPreview(null);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Passport photo handling error:", error);
        toast({
          title: "File upload error",
          description: "Please try uploading the file again",
          variant: "destructive",
        });
        e.target.value = '';
        setPassportPhoto(null);
        setPassportPhotoPreview(null);
      }
    }
  };

  const removeFile = () => {
    setAadharFile(null);
    setAadharPreview(null);
  };

  const removePassportPhoto = () => {
    setPassportPhoto(null);
    setPassportPhotoPreview(null);
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
  // upiId removed
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

      // Ensure Aadhaar number is unique by calling the server-side RPC
      try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rpcData, error: rpcError } = await (supabase as any).rpc('check_aadhar_unique', { aadhar_text: aadharNumber, current_user_id: user?.id || null });
        if (rpcError) throw rpcError;

        // rpcData should be boolean true if available
        if (!rpcData) {
          toast({
            title: "Aadhaar already used",
            description: "This Aadhaar number is already associated with another application.",
            variant: "destructive",
          });
          setLoading(false);
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        console.error("Error checking Aadhaar uniqueness via RPC:", err);
        // If RPC function not deployed, give a helpful message
        let msg = String(err);
        if (err instanceof Error) msg = err.message;
        else if (err && typeof err === 'object' && 'message' in err) {
          const m = (err as {message?: unknown}).message;
          if (typeof m === 'string') msg = m;
        }
        if (msg.includes('Could not find the function') || msg.includes('PGRST202') || msg.includes('404')) {
          toast({
            title: 'Server function missing',
            description: 'A server-side function check_aadhar_unique is not installed. Run the DB migration or create the RPC in Supabase SQL editor.',
            variant: 'destructive',
          });
          setLoading(false);
          setIsSubmitting(false);
          return;
        }
        // transient failure: continue but set status unknown
      }

      // Require Aadhaar file only for new applications or if no existing preview is available
      if (!existingApplicationId && !aadharFile && !aadharPreview) {
        toast({
          title: "Aadhaar Card Required",
          description: "Please upload your Aadhaar card",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Require passport photo for new applications or if no existing photo
      if (!existingApplicationId && !passportPhoto && !passportPhotoPreview) {
        toast({
          title: "Passport Photo Required",
          description: "Please upload your passport size photo",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Upload Aadhaar card file if the user selected a new one
      let aadharCardUrl = existingAadharPath || "";
      if (aadharFile) {
        try {
          const fileExt = aadharFile.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("aadhaar-cards")
            .upload(fileName, aadharFile, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            if (uploadError.message.includes('duplicate')) {
              toast({
                title: "File upload error",
                description: "A file with this name already exists. Please try again.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "File upload error",
                description: "Failed to upload Aadhaar card. Please try again.",
                variant: "destructive",
              });
            }
            throw uploadError;
          }

          aadharCardUrl = fileName;
        } catch (error) {
          console.error("Aadhaar upload error:", error);
          setLoading(false);
          setIsSubmitting(false);
          return;
        }
      }

      // Upload passport photo if the user selected a new one
      let passportPhotoUrl: string | null = existingPhotoPath;
      if (passportPhoto) {
        try {
          // Simple filename generation
          const fileExt = passportPhoto.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;

          // Simple direct upload
          const { error: uploadError } = await supabase.storage
            .from("passport-photos")
            .upload(fileName, passportPhoto, {
              upsert: true // Allow overwriting in case of conflict
            });

          if (uploadError) {
            console.error("Passport photo upload error:", uploadError);
            let msg: string | undefined;
            if (uploadError instanceof Error) msg = uploadError.message;
            else if (uploadError && typeof uploadError === 'object' && 'message' in uploadError) {
              const m = (uploadError as {message?: unknown}).message;
              if (typeof m === 'string') msg = m;
            }
            else msg = undefined;

            toast({
              title: "Upload failed",
              description: msg ? `Could not upload passport photo: ${msg}` : "Could not upload passport photo. Please try again.",
              variant: "destructive",
            });
            setLoading(false);
            setIsSubmitting(false);
            return;
          }
          
          passportPhotoUrl = fileName;
        } catch (error) {
          console.error("Passport photo upload error:", error);
          let msg: string | undefined;
          if (error instanceof Error) msg = error.message;
          else if (error && typeof error === 'object' && 'message' in error) {
            const m = (error as {message?: unknown}).message;
            if (typeof m === 'string') msg = m;
            else msg = String(error);
          } else msg = String(error);

          toast({
            title: "Upload error",
            description: msg ? `Failed to upload passport photo: ${msg}` : "Failed to upload passport photo. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          setIsSubmitting(false);
          return;
        }
      }

      const applicationData = {
        user_id: user.id,
        full_name: fullName,
        address,
        phone,
        aadhar_number: aadharNumber,
        pincode,
        city,
        state,
  // upi_id removed
        aadhar_card_url: aadharCardUrl,
        passport_photo_url: passportPhotoUrl ?? undefined,
        family_members: familyMembers,
        donation_amount: 1000,
        status: existingApplicationId ? undefined : "pending",
      } as unknown as TablesInsert<"membership_applications">;

      if (existingApplicationId) {
        // Update existing application
        // Omit undefined fields to avoid overwriting existing values unintentionally
        const updatePayload = { ...applicationData } as Record<string, unknown>;
        if (updatePayload.passport_photo_url === undefined) {
          delete updatePayload.passport_photo_url;
        }
        if (updatePayload.aadhar_card_url === undefined) {
          delete updatePayload.aadhar_card_url;
        }

        const { error: updateError } = await supabase
          .from("membership_applications")
          .update(updatePayload)
          .eq("id", existingApplicationId);

        if (updateError) throw updateError;

        // Update auth user metadata so dashboard/profile shows the new name
        try {
          await supabase.auth.updateUser({ data: { full_name: fullName, phone } });
        } catch (err) {
          console.warn("Could not update auth user metadata:", err);
        }

        toast({
          title: "Application Updated",
          description: "Your membership application has been updated successfully.",
        });

        navigate("/dashboard");
      } else {
        // Insert new application
        const { error } = await supabase.from("membership_applications").insert(applicationData);
        if (error) throw error;

        // Also update auth user metadata after new application so welcome/profile updates
        try {
          await supabase.auth.updateUser({ data: { full_name: fullName, phone } });
        } catch (err) {
          console.warn("Could not update auth user metadata:", err);
        }

        toast({
          title: "Application Submitted!",
          description: "Your membership application has been submitted successfully.",
        });

        navigate("/dashboard");
      }
    } catch (error: unknown) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/5 to-background pb-20 md:pb-0 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/8 rounded-full blur-[100px]" />
      </div>

      <header className="border-b glass border-primary/10 sticky top-0 z-50 shadow-[var(--shadow-temple)]">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" size="icon" className="temple-glow">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <Church className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" strokeWidth={1.8} />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold gradient-text tracking-tight">
            Membership Application
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl relative z-10">
        <Card className="shadow-[var(--shadow-temple)] border-primary/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Temple Membership Form</CardTitle>
            <CardDescription className="text-base">
              Fill in your details to become a temple member. Membership fee: ₹1,000
            </CardDescription>
          </CardHeader>
          {existingApplicationId && (
            <div className="px-6">
              <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-100 text-sm text-yellow-800">
                You already have an application on file. Editing this form will update your existing application.
              </div>
            </div>
          )}
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
                {aadharNumber.length === 12 && (
                  <div className="mt-2 flex items-center">
                    {aadharStatus === 'checking' && (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin mr-2" aria-hidden />
                    )}
                    {aadharStatus === 'available' && (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" aria-hidden />
                    )}
                    {aadharStatus === 'taken' && (
                      <XCircle className="w-5 h-5 text-destructive mr-2" aria-hidden />
                    )}
                    <span className="sr-only">
                      {aadharStatus === 'checking' && 'Checking Aadhaar availability'}
                      {aadharStatus === 'available' && 'Aadhaar appears available'}
                      {aadharStatus === 'taken' && 'This Aadhaar is already associated with another application'}
                    </span>
                  </div>
                )}
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
                      // Require upload only for new applications (when no existing preview/path)
                      required={!existingApplicationId && !aadharPreview}
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

              <div className="space-y-2">
                <Label htmlFor="passportPhoto">Upload Passport Size Photo *</Label>
                {!passportPhotoPreview ? (
                  <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="passportPhoto"
                      accept="image/*,.pdf"
                      onChange={handlePassportPhotoChange}
                      className="hidden"
                      required={!existingApplicationId && !passportPhotoPreview}
                    />
                    <label
                      htmlFor="passportPhoto"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload passport size photo (Max 5MB)
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
                      onClick={removePassportPhoto}
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    {passportPhoto?.type.includes('pdf') ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">PDF</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{passportPhoto.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(passportPhoto.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={passportPhotoPreview}
                        alt="Passport photo preview"
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

              {/* Payment details removed: membership fee and UPI/QR handled externally now */}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity h-12 text-lg"
                disabled={loading || isSubmitting}
              >
                {loading ? (existingApplicationId ? "Updating..." : "Submitting...") : (existingApplicationId ? "Update Application" : "Submit Application")}
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
