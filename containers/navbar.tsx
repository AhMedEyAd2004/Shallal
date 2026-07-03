"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Products", href: "#" },
  { label: "Customer Stories", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
];

export default function Header() {
  const [isNearTop, setIsNearTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsNearTop(window.scrollY <= 50);
    };

    handleScroll(); // set initial state on mount (e.g. page refreshed mid-scroll)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-100 flex items-center h-16 justify-between px-6 py-3 md:py-4 shadow bg-white transition-all duration-300 ease-out ${
        isNearTop
          ? "top-0 left-0 translate-x-0 w-full max-w-full rounded-none"
          : "top-5 left-1/2 -translate-x-1/2 w-full max-w-5xl rounded-full mx-auto"
      }`}
    >
      <Link href="https://prebuiltui.com">
        <Image
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/prebuiltuiDummyLogo.svg"
          alt="Logo"
          width={140}
          height={32}
        />
      </Link>

      <nav className="hidden md:flex items-center justify-center gap-8 text-gray-900 text-sm font-normal">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            className="hover:text-indigo-600"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          className="size-8 border-slate-300 rounded-md"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 10.39a2.889 2.889 0 1 0 0-5.779 2.889 2.889 0 0 0 0 5.778M7.5 1v.722m0 11.556V14M1 7.5h.722m11.556 0h.723m-1.904-4.596-.511.51m-8.172 8.171-.51.511m-.001-9.192.51.51m8.173 8.171.51.511"
              stroke="#353535"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        <Button
          asChild
          className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium"
        >
          <Link href="#">Sign up</Link>
        </Button>
      </div>
    </header>
  );
}
