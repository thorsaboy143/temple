import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Church } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="text-center space-y-12 px-4 animate-fade-in-up">
        {/* Apple-style icon with subtle animation */}
        <div className="relative">
          <div className="w-28 h-28 rounded-[2rem] glass-strong flex items-center justify-center mx-auto shadow-apple-xl animate-scale-in">
            <Church className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Minimal typography */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-6xl font-semibold text-foreground tracking-tight">
            Temple Membership
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            Welcome to Our Sacred Community
          </p>
        </div>

        {/* Minimal loading indicator */}
        <div className="flex justify-center mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-[slide-right_1.5s_ease-in-out_infinite]" style={{
              animation: 'slide-right 1.5s ease-in-out infinite',
            }} />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Splash;
