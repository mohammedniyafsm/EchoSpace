"use client";

import axios from "axios";
import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
  DialogDescription, DialogTrigger, DialogTitle, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CommentItem from "./  CommentItem";
import CommentSkeleton from "@/components/ui/CommentSkeleton";
import { MessageSquare } from "lucide-react";

import { useState } from "react";

export default function CommentsDialog({
  sectionId,
  topic,
  comments,
  setComments,
  commentCount,
  setCommentCount,
  currentUserId,
  setEditingComment
} : any) {
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/feedback?sectionId=${sectionId}`);
    setComments(data);
    setLoading(false);
  };

  const deleteComment = async (id : any) => {
    await axios.delete("/api/feedback", { data: { feedbackId: id } });
    setComments((prev : any)  => prev.filter((c : any) => c.id !== id));
    setCommentCount((c : any) => c - 1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1" onClick={fetchComments}>
          <MessageSquare className="w-4 mr-1" /> View ({commentCount})
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Feedback & Comments</DialogTitle>
          <DialogDescription>For: {topic}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto space-y-2 scrollbar-hide">
          {loading ? (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              No comments yet.
            </p>
          ) : (
            comments.map((c :any, i : any) => (
              <CommentItem
                key={i}
                c={c}
                currentUserId={currentUserId}
                deleteComment={deleteComment}
                setEditingComment={setEditingComment}
              />
            ))
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
