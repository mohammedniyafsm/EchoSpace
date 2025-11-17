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

const CATEGORIES = ["All", "TECHS PARK", "Workshop", "Daily", "Talk", "Event"];

export default function SessionFilters({ selectedDate, onDateChange, category, onCategoryChange }: Props) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="flex gap-3 items-center">
      {/* Category select */}
    

      {/* Inline calendar (small) */}
      <div className="relative">
        <Button variant="outline" onClick={() => setCalendarOpen((s) => !s)} className="px-3 py-2">
          {selectedDate ? selectedDate.toLocaleDateString() : "Pick date"}
        </Button>

        {calendarOpen && (
            <div className="bg-card/40 border border-border rounded-lg p-3">
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={(d) => {
                  if (!d) return;

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const clickedDate = new Date(d);
                  clickedDate.setHours(0, 0, 0, 0);

                  if (clickedDate < today) {
                    alert("Cannot view past sessions");
                    return;
                  }

                  onDateChange(d);
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
