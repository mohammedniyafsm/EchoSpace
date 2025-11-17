"use client";

export default function CardSkeleton() {
  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 animate-pulse flex flex-col gap-3 h-60">
      {/* Category */}
      <div className="h-4 w-24 bg-neutral-700 rounded" />

      {/* Title */}
      <div className="h-5 w-56 bg-neutral-700 rounded" />

      {/* Description */}
      <div className="h-4 w-40 bg-neutral-800 rounded" />
      <div className="h-4 w-28 bg-neutral-800 rounded" />
      <div className="h-4 w-32 bg-neutral-800 rounded" />

      {/* Footer: buttons/avatar */}
      <div className="flex gap-3 mt-auto">
        <div className="h-10 w-24 bg-neutral-700 rounded" />
        <div className="h-10 w-24 bg-neutral-700 rounded" />
      </div>
    </div>
  );
}
