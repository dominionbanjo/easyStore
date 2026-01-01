import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface User {
  src: string;
  alt: string;
  fallback: string;
}

interface SocialProofBadgeProps {
  users: User[];
  rating: number;
  totalUsers: number;
  maxAvatars?: number;
}

export default function SocialProofBadge({
  users,
  rating,
  totalUsers,
  maxAvatars = 3,
}: SocialProofBadgeProps) {
  const displayedUsers = users.slice(0, maxAvatars);
  const remainingCount = users.length - maxAvatars;

  return (
    <div className="inline-flex items-center gap-4 rounded-full bg-white/80 backdrop-blur px-4 py-2 shadow-sm border">
      {/* Avatar Stack */}
      <div className="flex -space-x-2">
        {displayedUsers.map((user, index) => (
          <Avatar
            key={index}
            className="h-8 w-8 ring-2 ring-white border border-gray-200"
          >
            <AvatarImage src={user.src} alt={user.alt} />
            <AvatarFallback className="text-xs">{user.fallback}</AvatarFallback>
          </Avatar>
        ))}

        {remainingCount > 0 && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white border text-xs font-semibold text-gray-600">
            +{remainingCount}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-7 w-px bg-gray-200" />

      {/* Rating */}
      <div className="flex flex-col leading-tight">
        {/* Stars + Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : i < rating
                    ? "fill-yellow-400/60 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>

          <span className="text-base font-semibold text-gray-900">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Micro social proof */}
        <span className="text-xs text-gray-500 whitespace-nowrap">
          Rated by {totalUsers.toLocaleString()}+ vendors
        </span>
      </div>
    </div>
  );
}
