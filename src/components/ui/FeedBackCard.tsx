// components/ui/FeedBackCard.tsx
"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { inter } from "@/lib/fonts";

type CategoryType = "Event" | "Technical" | "Communication" | "Issue" | "General";

interface FeedBackCardProps {
  category?: CategoryType;
  title?: string;
  description?: string;
  timestamp?: string;
  author?: string;
  className?: string; // optional
}

export const FeedBackCard: React.FC<FeedBackCardProps> = ({
  category = "Technical",
  title = "Feedback Title",
  description = "Brief description of the feedback goes here.",
  timestamp = "2 hours ago",
  author = "John Doe",
  className,
}) => {
  const [likes, setLikes] = useState(0);

  const handleLike = () => setLikes(likes + 1);

  const categoryColors: Record<CategoryType, string> = {
    Event: "bg-blue-500",
    Technical: "bg-green-500",
    Communication: "bg-yellow-500",
    Issue: "bg-red-500",
    General: "bg-gray-600",
  };

  return (
    <div
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex flex-col min-h-16 w-full rounded-md border bg-transparent px-6 py-4 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
    >
      {/* Category Badge */}
      <span
        className={`inline-block ${categoryColors[category]
          } text-black text-xs font-semibold px-3 py-1 rounded-full mb-2 w-20`}
      >
        {category}
      </span>

      {/* Title */}
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      {/* Description */}
      <p className={`text-gray-400 mt-2 text-sm ${inter}`}>{description}</p>

      {/* Footer: author, timestamp & like button */}
      <div className="flex justify-between items-center mt-4 text-gray-400 text-xs">
        <span>
          By {author} • {timestamp}
        </span>
        <button
          onClick={handleLike}
          className="flex items-center gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                     4.42 3 7.5 3c1.74 0 3.41.81 
                     4.5 2.09C13.09 3.81 14.76 3 16.5 3 
                     19.58 3 22 5.42 22 8.5c0 3.78-3.4 
                     6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {likes}
        </button>
      </div>
    </div>
  );
};
