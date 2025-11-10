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
        className="w-full max-w-md mx-auto overflow-hidden bg-primary shadow-apple-xl border-0"
      >
        <div className="relative p-8 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Church className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">Temple Member</h2>
                <p className="text-white/70 text-xs font-light">Official ID Card</p>
              </div>
            </div>
          </div>

          {/* Member Photo */}
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-3xl border-3 border-white/20 overflow-hidden bg-white/10 backdrop-blur-sm shadow-apple-lg">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl text-white/70 font-semibold">
                    {fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Member Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
                Member ID
              </p>
              <p className="text-white font-semibold text-xl tracking-wide">
                {memberId}
              </p>
            </div>
            
            <div className="h-px bg-white/15" />
            
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
                Name
              </p>
              <p className="text-white font-semibold text-base">{fullName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
                  Phone
                </p>
                <p className="text-white font-medium text-sm">{phone}</p>
              </div>
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
                  Location
                </p>
                <p className="text-white font-medium text-sm">
                  {city}, {state}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
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
          <div className="mt-5 text-center">
            <p className="text-white/50 text-xs font-light">
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
