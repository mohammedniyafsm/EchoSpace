"use client";

import { useState } from "react";
import { inter } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface FeedBackCardProps {
  quote: string;
  author: string;
  likes: number;
  comments: number;
  categories?: string;
}

export function FeedCard({
  quote,
  author,
  likes,
  comments,
  categories,
}: FeedBackCardProps) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [allComments, setAllComments] = useState<string[]>([
    "Really good idea!",
    "Needs some improvement on execution.",
    "Loved the concept 👏",
  ]);

  const handleSubmit = () => {
    const newComment = isAnonymous ? "Anonymous: " + feedback : `You: ${feedback}`;
    setAllComments([...allComments, newComment]);
    setFeedback("");
    alert("✅ Feedback submitted successfully!");
  };

  return (
    <div className="bg-card/20 border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Top: Category + Like */}
      <div className="flex justify-between items-center">
        {categories && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-accent/20 text-accent-foreground">
            {categories}
          </span>
        )}

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted/30 hover:bg-accent/20 border border-border transition">
          <Heart className="w-4 h-4 text-accent-foreground" />
          <span className="text-sm font-medium text-accent-foreground">{likes}</span>
        </button>
      </div>

      {/* Quote */}
      <div className="pl-2">
        <h3 className={`${inter} text-base leading-relaxed text-foreground font-semibold`}>
          {quote}
        </h3>
      </div>

      {/* Author */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pl-2">
        <span className="font-medium text-foreground/80">by {author}</span>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3 pt-2">
        {/* Give Feedback Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 border-border hover:bg-accent/10 transition-transform duration-200 hover:scale-[1.03]"
            >
              Give Feedback
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] bg-background/95 border border-border text-foreground backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Share Feedback</DialogTitle>
              <DialogDescription>
                Tell us your thoughts about: <br />
                <strong>{quote}</strong> <br />
                by {author}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Write your feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Switch
                  id="anonymous-switch"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <Label htmlFor="anonymous-switch">
                  {isAnonymous ? "Post as Anonymous" : "Show my name"}
                </Label>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Comments Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 border border-border transition-transform duration-200 hover:scale-[1.03]"
            >
              <MessageSquare className="w-4 h-4" />
              View ({allComments.length})
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] bg-background/95 border border-border text-foreground backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Feedback & Comments</DialogTitle>
              <DialogDescription>
                See what others have said about: <br />
                {quote}
              </DialogDescription>
            </DialogHeader>

            {/* Comments scroll area with hidden scrollbar */}
            <div className="mt-4 max-h-[300px] overflow-y-auto space-y-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {allComments.length > 0 ? (
                allComments.map((comment, index) => (
                  <div
                    key={index}
                    className="p-3 border border-border rounded-lg bg-muted/30 text-sm text-foreground"
                  >
                    {comment}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
