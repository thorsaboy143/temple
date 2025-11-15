import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We sent a verification link to your email address. Please click the link to confirm your account. After verifying, return here and sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Didn't get the email? Check your spam folder or click below to go back and try logging in once verified.
          </p>
          <AnimatedButton onClick={() => navigate('/auth?mode=login')} className="w-full">
            Go to Sign In
          </AnimatedButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;