"use client";

import { useState } from "react";
import { inter } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useSession } from "next-auth/react";

import LikeButton from "./ LikeButton";
import FeedbackDialog from "./FeedbackDialog";
import CommentsDialog from "./ CommentsDialog";
import EditCommentDialog from "./ EditCommentDialog";

interface FeedCardProps {
  id: string;
  topic: string;
  category: string;
  user: { username: string };
  date: string;
  _count: { sectionLikes: number; feedback: number };
  sectionLikes?: { id: string }[];
}

export default function FeedCard(props: FeedCardProps) {
  const { id, topic, category, user, date, _count, sectionLikes = [] } = props;

  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // Local states that children will use
  const [liked, setLiked] = useState(sectionLikes.length > 0);
  const [likeCount, setLikeCount] = useState(_count.sectionLikes);
  const [commentCount, setCommentCount] = useState(_count.feedback);

  // Editing state (shared)
  const [editingComment, setEditingComment] = useState(null);
  const [comments, setComments] = useState([]);

  return (
    <div className="bg-card/20 border border-border rounded-2xl p-5 flex flex-col gap-3 bg-gradient-to-br from-gray-900 via-neutral-950 to-black text-white border border-gray-700  ">

      {/* --- Category + Like --- */}
      <div className="flex justify-between items-center">
        <span className="text-xs px-2.5 py-1 rounded-md bg-accent/20">
          {category}
        </span>

        <LikeButton
          liked={liked}
          likeCount={likeCount}
          setLiked={setLiked}
          setLikeCount={setLikeCount}
          sectionId={id}
        />
      </div>

      {/* Topic */}
      <h3 className={`${inter} text-base font-semibold pl-2`}>{topic}</h3>

      {/* Author + Date */}
      <div className="flex justify-between pl-2 text-sm text-muted-foreground">
        <span>by {user.username}</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>

      {/* Feedback + View Button */}
      <div className="flex gap-3 pt-2">
        <FeedbackDialog sectionId={id} topic={topic} user={user}
          setCommentCount={setCommentCount}
        />

        <CommentsDialog
          sectionId={id}
          topic={topic}
          comments={comments}
          setComments={setComments}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
          currentUserId={currentUserId}
          setEditingComment={setEditingComment}
        />
      </div>

      <EditCommentDialog
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        setComments={setComments}
      />
    </div>
  );
}
