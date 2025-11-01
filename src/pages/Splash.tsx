import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Church } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-primary animate-gradient">
      <div className="text-center space-y-8 px-4">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-background to-background/90 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <Church className="w-20 h-20 text-primary" />
          </div>
          <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-background/20 animate-ping" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground">
            Temple Membership
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90">
            Welcome to Our Sacred Community
          </p>
        </div>

        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-3 h-3 bg-primary-foreground rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Splash;
