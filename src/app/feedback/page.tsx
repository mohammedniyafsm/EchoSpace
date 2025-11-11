"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextAnimate } from "@/components/ui/text-animate";
import { bricolage_grotesque, inter } from "@/lib/fonts";
import { FeedCard } from "@/components/ui/FeedCard";
import FeedComponent from "@/components/FeedComponent";

function FeedBack() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="bg-black min-h-screen w-full text-white">

      <div className="pt-28 flex flex-col items-center">
        <div className="group rounded-full border border-black/5 bg-neutral-100/10 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200/20 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800">
          <span className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-400 hover:duration-300">
            ✨ All Sessions Archive
          </span>
        </div>

        <div className="text-center pt-8">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className={`${bricolage_grotesque} font-semibold text-white text-6xl`}
          >
            Explore All Sessions
          </TextAnimate>

          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className={`${inter} pt-4 text-center text-neutral-400`}
          >
            Browse through daily sessions, team discussions, and personal presentations
          </TextAnimate>

          {/* Search + Date Section */}
          <div className="flex gap-4 items-center mt-8">
            <Input
              placeholder="🔍 Search by topic, presenter or description..."
              className={`${bricolage_grotesque} py-6 px-4 w-[600px] rounded-2xl bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500`}
            />

            <Button type="submit" variant="outline" className="mt-1">
              Search
            </Button>

            {/* Date Picker */}
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button type="submit" className="mt-1">
                  {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
                </Button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-xl shadow-lg">
                  <Dialog.Title className="text-white text-lg font-semibold mb-4">
                    Select a Date
                  </Dialog.Title>

                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />

                  <div className="mt-4 flex justify-end gap-2">
                    <Dialog.Close asChild>
                      <Button variant="outline">Close</Button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>

      </div>

      <div className="">
        <FeedComponent />
      </div>

    </div>
  );
}

export default FeedBack;
