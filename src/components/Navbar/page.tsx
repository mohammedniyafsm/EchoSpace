"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignOutButton } from "@/components/ui/SignOutButton";
import { useSession } from "next-auth/react";

export const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* TOP NAVBAR */}
      <div className="fixed top-0 left-0 z-50 w-full bg-black px-6 md:px-12 h-20 
        flex items-center justify-between">

        {/* LEFT SIDE - LOGO */}
        <div className="flex items-center gap-2">
          <img src="/2.png" alt="logo" className="w-5 h-5" />
          <h1 className="text-white text-md font-sans">EchoSpace</h1>
        </div>

        {/* CENTER NAVBAR LINKS (DESKTOP ONLY) */}
        <div className="hidden md:flex gap-8 h-10 items-center font-light 
          absolute left-1/2 -translate-x-1/2">
          <Link className="text-[#ADADAD]" href="/">Home</Link>
          <Link className="text-[#ADADAD]" href="/session">Upcoming</Link>
          <Link className="text-[#ADADAD]" href="/feedback">Feedback</Link>
          <Link className="text-[#ADADAD]" href="/ideas">Ideas</Link>
          {session?.user?.role === "ADMIN" && (
            <Link className="text-[#ADADAD]" href="/admin">Admin</Link>
          )}
        </div>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden md:flex items-center">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <img
                src={session.user.image ?? "/default-avatar.png"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-white text-sm">{session.user.name}</p>
              <SignOutButton />
            </div>
          ) : (
            <Button className="bg-white text-black">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-1 bg-white rounded-md"></span>
          <span className="w-6 h-1 bg-white rounded-md"></span>
          <span className="w-6 h-1 bg-white rounded-md"></span>
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div className="md:hidden mt-20 w-full bg-black text-center flex flex-col gap-4 py-4">

          <Link onClick={closeMenu} className="text-[#ADADAD]" href="/">Home</Link>
          <Link onClick={closeMenu} className="text-[#ADADAD]" href="/session">Upcoming</Link>
          <Link onClick={closeMenu} className="text-[#ADADAD]" href="/feedback">Feedback</Link>
          <Link onClick={closeMenu} className="text-[#ADADAD]" href="/ideas">Ideas</Link>
          {session?.user?.role === "ADMIN" && (
            <Link onClick={closeMenu} className="text-[#ADADAD]" href="/admin">Admin</Link>
          )}

          

          {/* AUTH SECTION */}
          {session?.user ? (
            <div className="flex flex-col items-center gap-2 mt-2">
              <img
                src={session.user.image ?? "/default-avatar.png"}
                className="w-10 h-10 rounded-full"
                alt="profile"
              />
              <p className="text-white text-sm">{session.user.name}</p>
              <SignOutButton />
            </div>
          ) : (
            <Button className="bg-white text-black w-32 m-auto">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      )}
    </>
  );
};
