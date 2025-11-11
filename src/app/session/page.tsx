"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar"; // your shadcn calendar
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextAnimate } from "@/components/ui/text-animate";
import { bricolage_grotesque, inter } from "@/lib/fonts";
import SessionList from "@/components/sessions/SessionList";
import SessionFilters from "@/components/sessions/SessionFilters";

export default function SessionsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]); // replace `any` with proper type

  // MOCK DATA (replace by real API call)
  useEffect(() => {
    const mock = [
      {
        id: "s1",
        title: "Morning TED: The Future of Interfaces",
        speaker: "Dr. Ananya Rao",
        time: "2025-11-12T09:00:00.000Z",
        durationMin: 45,
        category: "TED Talk",
        summary:
          "Ananya explores the next wave of UX patterns shaped by AI and sensors.",
        location: "Main Hall",
        capacity: 120,
      },
      {
        id: "s2",
        title: "Design Crit: Dashboard Overhaul",
        speaker: "Kiran Patel",
        time: "2025-11-12T11:30:00.000Z",
        durationMin: 60,
        category: "Workshop",
        summary: "Hands-on session to redesign the admin dashboard.",
        location: "Room B",
        capacity: 20,
      },
      {
        id: "s3",
        title: "Daily Standup — Morning Team Sync",
        speaker: "Team Leads",
        time: "2025-11-13T06:30:00.000Z",
        durationMin: 15,
        category: "Daily",
        summary: "Quick planning and blockers.",
        location: "Zoom",
        capacity: 200,
      },
      {
        id: "s4",
        title: "Evening Talk: Cloud Backup Patterns",
        speaker: "Ravi Menon",
        time: "2025-11-14T17:00:00.000Z",
        durationMin: 50,
        category: "Talk",
        summary: "Comparing S3, Blob, and GCS for backup strategies.",
        location: "Main Hall",
        capacity: 100,
      },
      {
        id: "s5",
        title: "Next-Day: UX Lightning Talks",
        speaker: "Multiple",
        time: "2025-11-15T09:30:00.000Z",
        durationMin: 75,
        category: "Event",
        summary: "Short 5-min lightning talks from the UX team.",
        location: "Room A",
        capacity: 60,
      },
    ];
    setSessions(mock);
  }, []);

  // Filter logic: date, query, category
  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      // filter by date if selectedDate
      if (selectedDate) {
        const sd = new Date(selectedDate);
        sd.setHours(0, 0, 0, 0);
        const ed = new Date(selectedDate);
        ed.setHours(23, 59, 59, 999);
        const st = new Date(s.time);
        if (!(st >= sd && st <= ed)) return false;
      }
      if (category && category !== "All" && s.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !(
            s.title.toLowerCase().includes(q) ||
            s.speaker.toLowerCase().includes(q) ||
            s.summary.toLowerCase().includes(q)
          )
        )
          return false;
      }
      return true;
    });
  }, [sessions, selectedDate, query, category]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="pt-20 pb-8 px-6 md:px-20 lg:px-32 text-center">
        <div className="inline-block rounded-full px-4 py-1 border border-white/8 bg-white/3 text-sm text-neutral-200">
          ✨ Sessions & Talks — This Week
        </div>

        <h1 className={`${bricolage_grotesque} mt-6 text-5xl md:text-6xl font-semibold`}>
          Explore Sessions
        </h1>

        <p className="mt-3 max-w-2xl mx-auto text-neutral-400">
          See who’s presenting this week, join live talks, and add reminders.
          Filter by date, category or search across sessions.
        </p>
      </header>

      {/* Controls: search + date select + category */}
      <div className="px-6 md:px-20 lg:px-32 mb-8">
        <div className="bg-card/40 border border-border rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex gap-3 items-center w-full md:w-2/3">
            <Input
              placeholder="Search by title, speaker or summary..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-white placeholder:text-neutral-500"
            />
            <Button
              variant="ghost"
              onClick={() => {
                setQuery("");
                setCategory(null);
                setSelectedDate(null);
              }}
              className="text-neutral-300"
            >
              Reset
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            <SessionFilters
              selectedDate={selectedDate}
              onDateChange={(d) => setSelectedDate(d)}
              category={category}
              onCategoryChange={(c) => setCategory(c)}
            />
            <Button
              onClick={() => {
                // quick shortcut: jump to today
                setSelectedDate(new Date());
              }}
              className="hidden sm:inline-flex"
            >
              Today
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="px-6 md:px-20 lg:px-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: calendar + upcoming */}
          <aside className="lg:col-span-1">
            <div className="bg-card/30 border border-border rounded-2xl p-4 md:p-6 sticky top-28">
              <h3 className="text-lg font-semibold">Calendar</h3>
              <p className="text-sm text-neutral-400 mt-1">Pick a date to filter</p>

              <div className="mt-4">
                <Calendar
                  mode="single"
                  selected={selectedDate ?? undefined}
                  onSelect={(d) => setSelectedDate(d ?? null)}
                />
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-neutral-300">This week highlights</h4>
                <ul className="mt-3 space-y-3">
                  {sessions.slice(0, 3).map((s) => (
                    <li key={s.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-accent/20 text-accent-foreground text-xs font-semibold">
                        {new Date(s.time).toLocaleDateString(undefined, { day: "numeric" })}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-neutral-400">{s.speaker}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Middle & Right columns: session list */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Sessions</h2>
              <div className="text-sm text-neutral-400">
                {filtered.length} session{filtered.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Session cards list (two-column responsive inside this block) */}
            <SessionList sessions={filtered} />
          </div>
        </div>
      </section>
    </main>
  );
}
