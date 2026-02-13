"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextAnimate } from "@/components/ui/text-animate";
import FeedComponent from "@/components/FEEDBACK-COMP/FeedComponent";
import { bricolage_grotesque, inter } from "@/lib/fonts";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function FeedBack() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);

  const { todayStart, yesterday, dayBefore, threeDaysAgo } = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const y = new Date(start);
    y.setDate(y.getDate() - 1);

    const two = new Date(start);
    two.setDate(two.getDate() - 2);

    const three = new Date(start);
    three.setDate(three.getDate() - 3);

    return {
      todayStart: start,
      yesterday: y,
      dayBefore: two,
      threeDaysAgo: three,
    };
  }, []);

  if (status === "loading") return null;

  if (!session) {
    redirect("/sign-in");
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatQueryDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleSearch = () => {
    if (!selectedDate) {
      alert("Select a past date to search completed sessions.");
      return;
    }

    if (selectedDate && selectedDate >= todayStart) {
      alert("Feedback can be given only for sessions from past dates.");
      return;
    }
    setIsSearching(true);
  };

  const resetAll = () => {
    setSearch("");
    setSelectedDate(undefined);
    setIsSearching(false);
  };

  let query = "";
  const trimmed = search.trim();

  if (isSearching) {
    query = `topic=${trimmed}&username=${trimmed}&date=${
      selectedDate ? formatQueryDate(selectedDate) : ""
    }`;
  }

  return (
    <div className="bg-black min-h-screen w-full text-white px-4">
      <div className="pt-28 flex flex-col items-center text-center">

        <div className="group rounded-full bg-neutral-100/10 px-4 py-1 text-sm">
          ✨ Completed Sessions
        </div>

        <div className="text-center pt-8">
          <TextAnimate
            animation="blurInUp"
            by="character"
            className={`${bricolage_grotesque} text-4xl md:text-6xl font-semibold leading-tight`}
          >
            Give Feedback for Completed Sessions
          </TextAnimate>

          <TextAnimate
            animation="blurInUp"
            by="character"
            className={`${inter} pt-4 text-neutral-400 text-sm md:text-base`}
          >
            Use this page for sessions that already happened. For upcoming sessions,
            open the Sessions page.
          </TextAnimate>

          {/* SEARCH + BUTTONS + DATE PICKER */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-10 w-full">
            
            {/* SEARCH INPUT */}
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search by topic or presenter..."
              className="py-5 px-4 w-full md:w-[500px] max-w-lg rounded-2xl bg-neutral-900 border border-neutral-700"
            />

            <div className="flex gap-3 flex-wrap justify-center">
              <Button variant="outline" onClick={handleSearch}>
                Search
              </Button>

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

                <Dialog.Content
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                             bg-background p-6 rounded-xl shadow-lg w-[90vw] max-w-sm"
                >
                  <Dialog.Title className="text-lg font-semibold mb-3">
                    Pick a Date
                  </Dialog.Title>

                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {
                      if (d && d < todayStart) {
                        setSelectedDate(d);
                        setIsSearching(true);
                      } else {
                        alert("Select a past date.");
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
      </div>

      {/* FEED RESULTS */}
      <div className="pt-4 pb-20 space-y-2">
        {isSearching ? (
          <FeedComponent heading="Search Results" query={query} />
        ) : (
          <>
            <FeedComponent
              heading="Yesterday Sessions"
              query={`date=${formatQueryDate(yesterday)}`}
            />
            <FeedComponent
              heading="2 Days Ago"
              query={`date=${formatQueryDate(dayBefore)}`}
            />
            <FeedComponent
              heading="3 Days Ago"
              query={`date=${formatQueryDate(threeDaysAgo)}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
