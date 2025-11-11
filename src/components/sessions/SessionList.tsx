"use client";

import { useState } from "react";
import SessionDetailDialog from "./SessionDetailDialog";
import { Button } from "@/components/ui/button";

export default function SessionList({ sessions }: { sessions: any[] }) {
  if (!sessions || sessions.length === 0) {
    return <div className="text-neutral-400 py-12">No sessions for this filter.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} />
      ))}
    </div>
  );
}

function SessionCard({ session }: { session: any }) {
  const start = new Date(session.time);
  return (
    <article className="bg-card/20 border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{session.category}</div>
          <h3 className="text-lg font-semibold mt-1">{session.title}</h3>
          <div className="text-sm text-neutral-400 mt-1">{session.speaker}</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-neutral-400">{start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
          <div className="text-xs text-neutral-500">{session.location}</div>
        </div>
      </div>

      <p className="text-sm text-neutral-300 line-clamp-3">{session.summary}</p>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <div className="text-xs px-2 py-1 rounded-md bg-accent/20 text-accent-foreground">{session.durationMin} min</div>
          <div className="text-xs px-2 py-1 rounded-md bg-muted/30 text-neutral-300">Cap {session.capacity}</div>
        </div>

        <div className="flex items-center gap-2">
          <SessionDetailDialog session={session}>
            <Button size="sm">Details</Button>
          </SessionDetailDialog>
          <Button size="sm" variant="ghost">Remind</Button>
        </div>
      </div>
    </article>
  );
}
