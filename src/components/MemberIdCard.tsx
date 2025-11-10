import { forwardRef } from "react";
import { Church } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MemberIdCardProps {
  memberId: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  approvedDate: string;
  avatarUrl?: string;
}

const MemberIdCard = forwardRef<HTMLDivElement, MemberIdCardProps>(
  ({ memberId, fullName, phone, city, state, approvedDate, avatarUrl }, ref) => {
    return (
      <Card
        ref={ref}
        className="w-full max-w-md mx-auto overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary shadow-[var(--shadow-temple)]"
      >
        <div className="relative p-6 pb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Church className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Temple Member</h2>
                <p className="text-white/80 text-xs">Official ID Card</p>
              </div>
            </div>
          </div>

          {/* Member Photo */}
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 overflow-hidden bg-white/10 backdrop-blur-sm">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl text-white/60 font-bold">
                    {fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Member Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                Member ID
              </p>
              <p className="text-white font-bold text-xl tracking-wide">
                {memberId}
              </p>
            </div>
            
            <div className="h-px bg-white/20" />
            
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                Name
              </p>
              <p className="text-white font-semibold text-lg">{fullName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  Phone
                </p>
                <p className="text-white font-medium text-sm">{phone}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  Location
                </p>
                <p className="text-white font-medium text-sm">
                  {city}, {state}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                Member Since
              </p>
              <p className="text-white font-medium text-sm">
                {new Date(approvedDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-white/60 text-xs">
              This card is valid for temple services and events
            </p>
          </div>
        </div>
      </Card>
    );
  }
);

MemberIdCard.displayName = "MemberIdCard";

export default MemberIdCard;
