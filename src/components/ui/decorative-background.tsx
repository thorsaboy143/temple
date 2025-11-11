import { cn } from "@/lib/utils";

export const GlowingDots = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-secondary/20 rounded-full blur-3xl" />
    </div>
  );
};

export const GridPattern = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)] dark:stroke-gray-700/30">
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern
            id="auth-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            x="-12"
            y="-12"
          >
            <path d="M.5 40V.5H40" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#auth-grid)" />
      </svg>
    </div>
  );
};

interface DecorativeBackgroundProps {
  className?: string;
}

export const DecorativeBackground = ({ className }: DecorativeBackgroundProps) => {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      <GridPattern />
      <GlowingDots />
    </div>
  );
};