"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  selectedDate: Date | null;
  onDateChange: (d: Date | null) => void;
  category: string | null;
  onCategoryChange: (c: string | null) => void;
}

const CATEGORIES = ["All", "TED Talk", "Workshop", "Daily", "Talk", "Event"];

export default function SessionFilters({ selectedDate, onDateChange, category, onCategoryChange }: Props) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="flex gap-3 items-center">
      {/* Category select */}
      <Select value={category ?? "All"} onValueChange={(v) => onCategoryChange(v === "All" ? null : v)}>
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((c) => (
            <SelectItem value={c} key={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Inline calendar (small) */}
      <div className="relative">
        <Button variant="outline" onClick={() => setCalendarOpen((s) => !s)} className="px-3 py-2">
          {selectedDate ? selectedDate.toLocaleDateString() : "Pick date"}
        </Button>

        {calendarOpen && (
          <div className="absolute z-40 mt-2">
            <div className="bg-card/40 border border-border rounded-lg p-3">
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={(d) => {
                  onDateChange(d ?? null);
                  setCalendarOpen(false);
                }}
              />
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" onClick={() => { onDateChange(null); setCalendarOpen(false); }}>Clear</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
