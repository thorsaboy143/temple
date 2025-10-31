import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Church, Heart } from "lucide-react";
import upiQrCode from "@/assets/upi-qr-code.png";

const Donate = () => {
  const [user, setUser] = useState<any>(null);
  const [donorName, setDonorName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setDonorName(session.user.user_metadata?.full_name || "");
        setPhone(session.user.user_metadata?.phone || "");
      }
    });
  }, []);

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!donorName || !phone || !amount || !upiId) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (parseFloat(amount) < 10) {
        toast({
          title: "Invalid Amount",
          description: "Minimum donation amount is ₹10",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Here you would typically store the donation record
      toast({
        title: "Thank You!",
        description: `Your donation of ₹${amount} has been recorded. Please complete the payment using the UPI QR code above.`,
      });

      // Reset form
      setAmount("");
      setCustomAmount("");
      setUpiId("");
      
      if (!user) {
        setDonorName("");
        setPhone("");
      }
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
          <Button onClick={() => navigate(user ? "/dashboard" : "/")} variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Church className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Make a Donation
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-[var(--shadow-temple)]">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl">Support Our Temple</CardTitle>
            <CardDescription className="text-base">
              Your generous donation helps us maintain the temple and serve the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment QR Code */}
              <div className="p-6 bg-muted/50 rounded-lg border border-primary/20 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Scan to Pay</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use any UPI app to scan and donate
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <img 
                      src={upiQrCode} 
                      alt="UPI Payment QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              </div>

              {/* Donation Amount Selection */}
              <div className="space-y-3">
                <Label>Select Donation Amount *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAmounts.map((amt) => (
                    <Button
                      key={amt}
                      type="button"
                      variant={amount === amt.toString() ? "default" : "outline"}
                      onClick={() => handleAmountSelect(amt)}
                      className="h-12"
                    >
                      ₹{amt}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customAmount">Or Enter Custom Amount</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter amount (min ₹10)"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    min="10"
                  />
                </div>
                {amount && (
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Selected Amount</p>
                    <p className="text-3xl font-bold text-primary">₹{amount}</p>
                  </div>
                )}
              </div>

              {/* Donor Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="donorName">Your Name *</Label>
                  <Input
                    id="donorName"
                    type="text"
                    placeholder="Enter your full name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
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
                  <Label htmlFor="upiId">Your UPI ID *</Label>
                  <Input
                    id="upiId"
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Enter the UPI ID used for payment</p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity h-12 text-lg"
                disabled={loading || !amount}
              >
                {loading ? "Processing..." : "Confirm Donation"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                After payment, please submit this form to help us track your donation
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Donate;
