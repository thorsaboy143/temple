import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, User, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: CreditCard, label: "Payment", path: "/payment-details" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 z-50 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-14 rounded-xl transition-all active:scale-95",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={1.5} />
              <span className="text-[11px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
