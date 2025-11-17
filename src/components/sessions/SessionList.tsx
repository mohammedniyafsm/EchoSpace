// src/components/sessions/SessionList.tsx
"use client";

import { bricolage_grotesque } from "@/lib/fonts";

interface Session {
  id: string;
  title: string;
  speaker: string;
  time: string;
  category: string;
  summary?: string;
}

interface SessionListProps {
  sessions: Session[] | null;
  loading?: boolean;
}

export default function SessionList({ sessions, loading }: SessionListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SessionCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return 
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sessions.map((s) => (
        <SessionCard key={s.id} session={s} />
      ))}
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  return (
    <div className="bg-card/20 border border-border rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
      <div className="text-xs text-neutral-400 mt-1">
        <span className="border p-2 rounded-xl">{session.category}</span>
      </div>
      <h3 className={`text-lg font-semibold mb-1 pt-4 pl-2 ${bricolage_grotesque}`}>
        {session.title}
      </h3>
      <div className="text-xs text-neutral-300 pl-2 flex items-end">
        Speaker: {session.speaker}
      </div>
    </div>
  );
}

function SessionCardSkeleton() {
  return (
    <div className="bg-card/10 border border-border rounded-xl p-4 animate-pulse">
      <div className="h-4 w-20 bg-neutral-400 rounded-full mb-3"></div>
      <div className="h-6 w-3/4 bg-neutral-400 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-neutral-400 rounded"></div>
    </div>
  );
}
