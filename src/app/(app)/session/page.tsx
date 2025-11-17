// src/app/(app)/session/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bricolage_grotesque } from "@/lib/fonts";
import SessionList from "@/components/sessions/SessionList";
import SessionFilters from "@/components/sessions/SessionFilters";
import axios from "axios";
import { getSession } from "next-auth/react";

interface Session {
  id: string;
  title: string;
  speaker: string;
  time: string;
  category: string;
  summary?: string;
  location?: string;
  capacity?: number;
  durationMin?: number;
}

export default function SessionsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Only run client-specific code
  useEffect(() => {
    setIsClient(true);
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const session = await getSession(); // Get NextAuth session
        if (!session) {
          console.error("User not logged in");
          setSessions([]);
          return;
        }

        const token = (session as any).accessToken; // adjust according to your session object
        const res = await axios.get("/api/section/user/search", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sections = res.data.sections || [];
        const mapped = sections.map((s: any) => ({
          id: s.id,
          title: s.topic,
          speaker: s.user?.username || "Unknown",
          time: s.date,
          category: s.category,
          summary: s.summary || "",
          location: s.location,
          capacity: s.capacity,
          durationMin: s.durationMin,
        }));

        setSessions(mapped);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
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
        if (!(s.title.toLowerCase().includes(q) || s.speaker.toLowerCase().includes(q))) return false;
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
        <h1 className={`${bricolage_grotesque} mt-6 text-5xl md:text-6xl font-semibold`}>Explore Sessions</h1>
        <p className="mt-3 max-w-2xl mx-auto text-neutral-400">
          See who’s presenting this week, join live talks, and add reminders.
          Filter by date, category or search across sessions.
        </p>
      </header>

      {/* Controls */}
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
                if (isClient) setSelectedDate(new Date());
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
            <Button onClick={() => isClient && setSelectedDate(new Date())} className="hidden sm:inline-flex">
              Today
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="px-6 md:px-20 lg:px-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-card/30 border border-border rounded-2xl p-4 md:p-6 sticky top-28">
              <h3 className="text-lg font-semibold">Calendar</h3>
              <p className="text-sm text-neutral-400 mt-1">Pick a date to filter</p>

              <div className="mt-4 flex justify-center">
                {isClient && (
                  <Calendar
                    className="border rounded-xl"
                    mode="single"
                    selected={selectedDate ?? undefined}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    onSelect={(d) => d && setSelectedDate(d)}
                  />
                )}
              </div>
            </div>
          </aside>

          {/* Session list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Sessions</h2>
              <div className="text-sm text-neutral-400">{filtered.length} session{filtered.length !== 1 ? "s" : ""}</div>
            </div>

            <SessionList sessions={filtered} loading={loading} />
          </div>
        </div>
      </section>
    </main>
  );
}
