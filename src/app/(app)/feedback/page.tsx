"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextAnimate } from "@/components/ui/text-animate";
import FeedComponent from "@/components/FEEDBACK-COMP/FeedComponent";
import { bricolage_grotesque, inter } from "@/lib/fonts";

export default function FeedBack() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);

  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  const dayBefore = new Date(Date.now() - 2 * 86400000);

  // Format for display
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Format for query (YYYY-MM-DD) preserving local date
  const formatQueryDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle search click
  const handleSearch = () => {
    if (selectedDate && selectedDate > new Date()) {
      alert("You cannot search for future sessions.");
      return;
    }
    setIsSearching(true);
  };

  // Reset search
  const resetAll = () => {
    setSearch("");
    setSelectedDate(undefined);
    setIsSearching(false);
  };

  let query = "";
  const trimmed = search.trim();

  if (isSearching) {
    query = `topic=${trimmed}&username=${trimmed}&date=${selectedDate ? formatQueryDate(selectedDate) : ""
      }`;

  }

  return (
    <div className="bg-black min-h-screen w-full text-white">
      <div className="pt-28 flex flex-col items-center">

        <div className="group rounded-full bg-neutral-100/10 px-4 py-1">
          ✨ All Sessions Archive
        </div>

        <div className="text-center pt-8">
          <TextAnimate
            animation="blurInUp"
            by="character"
            className={`${bricolage_grotesque} text-6xl font-semibold`}
          >
            Explore All Sessions
          </TextAnimate>

          <TextAnimate
            animation="blurInUp"
            by="character"
            className={`${inter} pt-4 text-neutral-400`}
          >
            Browse through daily sessions and interesting presentations
          </TextAnimate>

          <div className="flex gap-4 items-center mt-8">

            {/* SEARCH INPUT */}
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search by topic or presenter..."
              className="py-6 px-4 w-[600px] rounded-2xl bg-neutral-900 border border-neutral-700"
            />

            <Button variant="outline" onClick={handleSearch}>
              Search
            </Button>

            {/* RESET BUTTON */}
            {isSearching && (
              <Button variant="destructive" onClick={resetAll}>
                Reset
              </Button>
            )}

            {/* DATE PICKER */}
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button>
                  {selectedDate ? formatDate(selectedDate) : "Select Date"}
                </Button>
              </Dialog.Trigger>

              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-xl shadow-lg">
                <Dialog.Title className="text-lg font-semibold mb-3">
                  Pick a Date
                </Dialog.Title>

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => {
                    if (d && d <= new Date()) {
                      setSelectedDate(d);
                      setIsSearching(true);
                      return;
                    } else {
                      alert("Not Available");
                      return;
                    }
                  }}
                />


                <div className="flex justify-end pt-4">
                  <Dialog.Close asChild>
                    <Button variant="outline">Close</Button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        </div>
      </div>

      {/* FEED RESULTS */}
      <div>
        {isSearching ? (
          <FeedComponent heading="Search Results" query={query} />
        ) : (
          <>
            <FeedComponent
              heading="Today's Highlights"
              query={`date=${formatQueryDate(today)}`}
            />
            <FeedComponent
              heading="Yesterday's Highlights"
              query={`date=${formatQueryDate(yesterday)}`}
            />
            <FeedComponent
              heading="Day Before"
              query={`date=${formatQueryDate(dayBefore)}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
