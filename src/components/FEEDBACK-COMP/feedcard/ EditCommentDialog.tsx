"use client";

import axios from "axios";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function EditCommentDialog({ editingComment, setEditingComment, setComments } : any) {
  const [text, setText] =useState(" ");

  useEffect(() => {
    setText(editingComment?.comment || "");
  }, [editingComment]);

  const saveEdit = async () => {
    await axios.put("/api/feedback", {
      feedbackId: editingComment.id,
      comment: text
    });

    setComments((prev : any) =>
      prev.map((c : any)=> (c.id === editingComment.id ? { ...c, comment: text } : c))
    );

    setEditingComment(null);
  };

  return (
    <Dialog open={!!editingComment} onOpenChange={() => setEditingComment(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>

        <Textarea value={text} onChange={e => setText(e.target.value)} />

        <DialogFooter>
          <Button variant="outline" onClick={() => setEditingComment(null)}>
            Cancel
          </Button>
          <Button onClick={saveEdit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
