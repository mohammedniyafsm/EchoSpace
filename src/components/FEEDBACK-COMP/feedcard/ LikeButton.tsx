"use client";

import { useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";

interface Props {
  liked: boolean;
  likeCount: number;
  setLiked: any;
  setLikeCount: any;
  sectionId: string;
}

export default function LikeButton({
  liked,
  likeCount,
  setLiked,
  setLikeCount,
  sectionId,
}: Props) {
  const [loading, setLoading] = useState(false);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(wasLiked ? likeCount - 1 : likeCount + 1);

    try {
      if (!wasLiked)
        await axios.post("/api/section/user/like", { sectionId });
      else
        await axios.delete("/api/section/user/like", { data: { sectionId } });
    } catch (e) {
      setLiked(wasLiked);
      setLikeCount(likeCount);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/30 hover:bg-muted/50"
    >
      <Heart className={`w-4 h-4 ${liked ? "fill-white text-white" : ""}`} />
      <span>{likeCount}</span>
    </button>
  );
}
