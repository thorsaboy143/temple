import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Church, Copy, Check } from "lucide-react";
import QRCode from "qrcode";
import { useToast } from "@/hooks/use-toast";
import MobileNav from "@/components/MobileNav";

const PaymentDetails = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const upiId = "fhdjdnjdjjrjtn@okaxis";
  const amount = 1000;

  useEffect(() => {
    const generateQRCode = async () => {
      const upiString = `upi://pay?pa=${upiId}&pn=Temple Membership&am=${amount}&cu=INR`;
      try {
        const url = await QRCode.toDataURL(upiString, {
          width: 400,
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
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "UPI ID copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background pb-20 md:pb-0">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-3">
          <Button onClick={() => navigate("/dashboard")} variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Church className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Payment Details
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-[var(--shadow-temple)]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Temple Membership Payment</CardTitle>
            <CardDescription className="text-base">
              Complete your membership by making the payment below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg border border-primary/20 p-6 space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Amount to Pay</p>
                <p className="text-5xl font-bold text-primary">₹{amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Membership Fee</p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="UPI Payment QR Code" 
                      className="w-64 h-64"
                    />
                  )}
                </div>
                <p className="text-center text-sm font-medium text-muted-foreground">
                  Scan with any UPI app to pay
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
                    <p className="font-mono font-medium">{upiId}</p>
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Payment Instructions</h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Open any UPI app (Google Pay, PhonePe, Paytm, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Scan the QR code or use the UPI ID above</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>Enter the amount: ₹{amount.toLocaleString()}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>Complete the payment and save the transaction ID</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">5.</span>
                  <span>Enter your UPI ID in the membership form for verification</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => navigate("/apply")}
                className="flex-1"
              >
                Continue to Application
              </Button>
              <Button 
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="flex-1"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default PaymentDetails;
