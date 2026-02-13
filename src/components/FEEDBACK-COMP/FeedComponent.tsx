"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import  FeedCard  from "./feedcard/FeedCard";
import { bricolage_grotesque } from "@/lib/fonts";
import CardSkeleton from "../ui/CardSkeleton";

interface FeedProps {
  heading: string;
  query: string;
}

type SectionResult = {
  id: string;
  topic: string;
  category: string;
  date: string;
  user: { username: string };
  _count: { sectionLikes: number; feedback: number };
  sectionLikes?: { id: string }[];
};

export default function FeedComponent({ heading, query }: FeedProps) {
  const [sections, setSections] = useState<SectionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await axios.get(`/api/section/user/search?${query}`);
      setSections((res.data.sections || []) as SectionResult[]);
      setLoading(false);
    }
    fetchData();
  }, [query]);

  return (
    <section className="px-4 md:px-10 xl:px-20 pt-6 pb-4 bg-black text-white">
      <h2 className={`${bricolage_grotesque} text-3xl font-semibold`}>
        {heading}
      </h2>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex flex-wrap gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 mt-8">
          {sections.length === 0 ? (
            <p className="text-neutral-500">No data found</p>
          ) : (
            sections.map((feed, i) => (
              <div key={i} className="w-[400px]">
                <FeedCard {...feed} />
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
