"use client";

import { useState } from "react";
import axios from "axios";
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function FeedbackDialog({ sectionId, topic, user, setCommentCount } : any) {
  const [feedback, setFeedback] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const addComment = async () => {
    if (!feedback.trim() || feedback.length < 7) return;
    await axios.post("/api/feedback", { sectionId, comment: feedback, anonymous });
    setCommentCount((c : any) => c + 1);
    setFeedback("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">Give Feedback</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Feedback</DialogTitle>
          <DialogDescription>For: {topic} — by {user.username}</DialogDescription>
        </DialogHeader>

        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your feedback..."
        />

        <div className="flex items-center gap-2 mt-3">
          <Switch checked={anonymous} onCheckedChange={setAnonymous} />
          <Label>{anonymous ? "Anonymous" : "Show my name"}</Label>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button onClick={addComment}>Submit</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
