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
    maxAvatars = 3
}: SocialProofBadgeProps) {
    // Limit the number of avatars displayed
    const displayedUsers = users.slice(0, maxAvatars);
    const remainingCount = users.length - maxAvatars;

    return (
        <div className="inline-flex items-center gap-3 rounded-full px-4 py-2 ">
            {/* Avatar Stack */}
            <div className="flex -space-x-2">
                {displayedUsers.map((user, index) => (
                    <Avatar
                        key={index}
                        className="ring-2 ring-white border border-gray-200 h-8 w-8"
                    >
                        <AvatarImage src={user.src} alt={user.alt} />
                        <AvatarFallback className="text-xs">{user.fallback}</AvatarFallback>
                    </Avatar>
                ))}

                {/* Show remaining count if more users exist */}
                {remainingCount > 0 && (
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white border border-gray-200 text-xs font-medium text-gray-600">
                        +{remainingCount}
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300" />

            {/* Rating Section */}
            <div className="flex flex-col  gap-2">
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : i < rating
                                        ? 'fill-yellow-400/50 text-yellow-400'
                                        : 'fill-gray-200 text-gray-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Rating Text */}
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {rating.toFixed(1)} <span className="text-gray-500">by {totalUsers.toLocaleString()}+ vendors</span>
                </span>
            </div>
        </div>
    );
}
