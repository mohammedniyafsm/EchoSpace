"use client";

import { RainbowButton } from "@/components/ui/rainbow-button";
import { MarqueeDemo } from "@/components/ui/marquee-demo";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const getStartedHref = session ? "/feedback" : "/sign-in";

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/1.png"
        alt="Background"
        className="absolute inset-0 m-auto h-auto w-auto z-0 opacity-80 bottom-[400px] sm:bottom-[280px] lg:bottom-32 xl:bottom-0  -translate-y-14"
      />

      {/* Foreground Content */}
      <div className="z-10 text-center mt-42">
        <h1 className="font-zalando text-2xl md:text-5xl leading-tight bg-gradient-radial from-[#f9f9f9] to-[#555] bg-clip-text text-transparent">
          Start Hearing Voices <br /> You Could Have Grown
        </h1>

        <p className="text-[#b8b8b8] font-light mt-4 text-[9px] xl:text-base    tracking-wide">
          Join upcoming sessions, then give feedback on completed sessions. <br />
          Echo Space keeps sessions and feedback clearly separated.
        </p>

        <RainbowButton asChild className="mt-8 px-8 py-5 text-base font-medium rounded-xl">
          <Link href={getStartedHref}>Get Started</Link>
        </RainbowButton>
      </div>

      {/* Feedback Marquee */}
      <div className="mt-20 w-full">
        <MarqueeDemo />
      </div>
    </div>
  );
}
