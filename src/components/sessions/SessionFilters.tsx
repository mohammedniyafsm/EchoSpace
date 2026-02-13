"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  selectedDate: Date | null;
  onDateChange: (d: Date | null) => void;
  category: string | null;
  onCategoryChange: (c: string | null) => void;
}

const CATEGORIES = ["All", "SELF_INTRO", "QUOTE", "PRESENTATION"];

export default function SessionFilters({
  selectedDate,
  onDateChange,
  category,
  onCategoryChange,
}: Props) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="flex gap-3 items-center">

      {/* Category */}
      <Select
        value={category ?? "All"}
        onValueChange={(c) => onCategoryChange(c === "All" ? null : c)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Calendar */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setCalendarOpen((prev) => !prev)}
          className="px-3 py-2"
        >
          {selectedDate ? selectedDate.toLocaleDateString() : "Pick date"}
        </Button>

        {calendarOpen && (
          <div className="absolute bg-card/40 border mt-2 border-border rounded-lg p-3 z-10">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={(d?: Date) => {
                if (!d) return;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const clickedDate = new Date(d);
                clickedDate.setHours(0, 0, 0, 0);

                if (clickedDate < today) {
                  alert("Past sessions are available in Feedback page.");
                  return;
                }

                onDateChange(d);
                setCalendarOpen(false);
              }}
            />

            <div className="mt-2 flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  onDateChange(new Date());
                  setCalendarOpen(false);
                }}
              >
                Today
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
