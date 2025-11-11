import React from "react";
import { Church } from "lucide-react";

const SplashStatic: React.FC = () => {
  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-glow/5 via-background to-accent/5 overflow-hidden relative">
      {/* Animated glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
      </div>

  <div className="text-center space-y-12 px-4 motion-safe:animate-fade-in-up relative z-10">
        {/* Glowing temple icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-[2.5rem] blur-3xl opacity-50 animate-glow-pulse" />
          <div className="relative w-32 h-32 rounded-[2.5rem] glass-strong flex items-center justify-center mx-auto shadow-[var(--shadow-glow)] animate-scale-in border-2 border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-[2.5rem]" />
            <Church className="w-20 h-20 text-primary drop-shadow-[0_0_15px_hsl(var(--primary-glow)/0.5)]" strokeWidth={1.8} />
          </div>
        </div>
        
        {/* Spiritual typography */}
  <div className="space-y-4 motion-safe:animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl font-semibold gradient-text tracking-tight leading-tight">
            Temple Membership
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide">
            🙏 Welcome to Our Sacred Community
          </p>
        </div>

        {/* Spiritual loading indicator */}
  <div className="flex justify-center mt-12 motion-safe:animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-muted to-transparent rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-primary-glow to-accent rounded-full shadow-[var(--shadow-glow)]" style={{
              animation: 'slide-right 1.8s ease-in-out infinite',
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

export default SplashStatic;
