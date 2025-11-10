import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Printer, Share2, Church } from "lucide-react";
import MemberIdCard from "@/components/MemberIdCard";
import html2canvas from "html2canvas";
import MobileNav from "@/components/MobileNav";

interface MemberData {
  id: string;
  member_id: string;
  full_name: string;
  phone: string;
  city: string;
  state: string;
  created_at: string;
  avatar_url?: string;
}

const MemberCard = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("id");
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      if (!applicationId) {
        toast({
          title: "Error",
          description: "No application ID provided",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      const isAdmin = roles?.some((r) => r.role === "admin");

      const { data, error } = await supabase
        .from("membership_applications")
        .select("id, member_id, full_name, phone, city, state, created_at, user_id")
        .eq("id", applicationId)
        .eq("status", "approved")
        .single();

      if (error || !data) {
        toast({
          title: "Error",
          description: "Member card not found or not yet approved",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Check if user owns this application OR is an admin
      if (data.user_id !== session.user.id && !isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this card",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Fetch avatar from profiles (use the member's user_id, not the current user)
      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", data.user_id)
        .single();

      setMemberData({
        ...data,
        avatar_url: profile?.avatar_url,
      });
      setLoading(false);
    };

    fetchData();
  }, [navigate, applicationId, toast]);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = `member-card-${memberData?.member_id}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Downloaded!",
        description: "Your member card has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download card",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `member-card-${memberData?.member_id}.png`, {
          type: "image/png",
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Temple Member Card",
            text: `Member ID: ${memberData?.member_id}`,
            files: [file],
          });
        } else {
          toast({
            title: "Share not supported",
            description: "Your browser doesn't support sharing. Try downloading instead.",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share card",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Church className="w-16 h-16 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading your member card...</p>
        </div>
      </div>
    );
  }

  if (!memberData || !memberData.member_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Member card not available</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="glass border-b border-border/50 sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-6 py-4 flex items-center space-x-3">
          <Button 
            onClick={() => navigate(user?.email?.includes('admin') ? "/admin" : "/dashboard")} 
            variant="ghost" 
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-apple-md">
            <Church className="w-6 h-6 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Member ID Card
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="space-y-8 animate-fade-in-up">
          <div className="print:hidden">
            <MemberIdCard
              ref={cardRef}
              memberId={memberData.member_id}
              fullName={memberData.full_name}
              phone={memberData.phone}
              city={memberData.city}
              state={memberData.state}
              approvedDate={memberData.created_at}
              avatarUrl={memberData.avatar_url}
            />
          </div>

          <div className="hidden print:block">
            <MemberIdCard
              memberId={memberData.member_id}
              fullName={memberData.full_name}
              phone={memberData.phone}
              city={memberData.city}
              state={memberData.state}
              approvedDate={memberData.created_at}
              avatarUrl={memberData.avatar_url}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
            <Button
              onClick={handleDownload}
              size="lg"
              className="h-14 shadow-apple-md"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </Button>
            <Button
              onClick={handlePrint}
              variant="secondary"
              size="lg"
              className="h-14"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print
            </Button>
            <Button
              onClick={handleShare}
              variant="secondary"
              size="lg"
              className="h-14"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
};

export default MemberCard;
