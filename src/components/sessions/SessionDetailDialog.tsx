"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SessionDetailDialog({ session, children }: { session: any; children: ReactNode; }) {
  const [open, setOpen] = useState(false);

  const start = new Date(session.time);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{session.title}</DialogTitle>
          <DialogDescription className="text-sm text-neutral-400">
            by {session.speaker} • {start.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 text-sm text-neutral-300 space-y-3">
          <p>{session.summary}</p>

          <ul className="text-sm">
            <li><strong>Location:</strong> {session.location}</li>
            <li><strong>Capacity:</strong> {session.capacity}</li>
            <li><strong>Duration:</strong> {session.durationMin} min</li>
          </ul>
        </div>
        <DialogFooter className="mt-6 flex items-center justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={() => alert("Reminder set (mock)")}>Set Reminder</Button>
          <Button onClick={() => alert("Join session (mock)")}>Join</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
