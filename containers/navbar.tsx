"use client";

import { ThemeToggle } from "@/components/static/theme-toggle";
import { Button } from "@/components/ui/button";
import HoverText from "@/gsap-wrappers/Button-animation-onHover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader2, LogOut, MenuIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { RawSocialLink } from "@/components/social-links";

import { signOutAction } from "@/app/dashboard/actions";

type FooterAccountControlsProps = {
  email: string;
  createdAt?: string;
};

// Import your browser client builder
import { MobileMenu } from "@/components/custom/MobileMenu";
import { SOCIAL_PLATFORMS } from "@/components/social-links";
import { createClient } from "@/lib/client";
import type { User } from "@supabase/supabase-js";

// Code-split: GSAP timelines + portal panel markup only load when this
// chunk is actually rendered (i.e. once we know we're on a small screen).
// ssr: false means the server always renders null here. Combined with
// useMediaQuery's { initializeWithValue: false } below, the client's
// *first* render also evaluates isSmallerThanLg as false — matching the
// server exactly. The real value is only computed after mount, so there's
// no server/client disagreement to trigger a hydration mismatch.
const StaggeredMenu = dynamic(
  () => import("@/components/custom/staggeredMenu"),
  { ssr: false },
);

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navLinks = [
  { label: "About us", href: "/home#about" },
  { label: "Projects", href: "/home#projects" },
  { label: "Blogs", href: "/home#blogs" },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const isSmallerThanLg = useMediaQuery("(max-width: 1024px)", {
    initializeWithValue: false,
  });

  // State to hold the logged-in user data
  const [user, setUser] = useState<User | null>(null);

  const [socialLinks, setSocialLinks] = useState<RawSocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const init = async () => {
      const [
        {
          data: { user },
        },
        { data: socialLinksData },
      ] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("social_links").select("id, platform, url_or_number"),
      ]);
      setUser(user);
      setSocialLinks(socialLinksData ?? []);
      setLoading(false);
    };

    init();
  }, []);

  useGSAP(
    () => {
      ScrollTrigger.config({ ignoreMobileResize: true });
      const header = headerRef.current;
      if (!header) return;

      // Initialize GSAP's highly-optimized responsive engine
      const mm = gsap.matchMedia();

      // Only run this animation config if screen is 768px or wider (Tailwind md)
      mm.add("(min-width: 768px)", () => {
        gsap.set(header, { left: "50%", xPercent: -50 });

        const tl = gsap.timeline({ paused: true }).to(header, {
          top: 20,
          maxWidth: "64rem",
          borderRadius: 9999,
          duration: 0.3,
          ease: "power2.out",
        });

        const st = ScrollTrigger.create({
          start: 0,
          end: 50,
          onEnter: () => tl.play(),
          onLeaveBack: () => tl.reverse(),
        });

        if (window.scrollY > 50) tl.progress(1);

        // matchMedia automatically cleans up the ScrollTrigger and resets
        // the inline styles on mobile if the screen size falls below 768px.
        return () => {
          st.kill();
        };
      });

      // Master cleanup hook to kill the matchMedia listener on component unmount
      return () => mm.revert();
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-100 flex items-center h-16 justify-between px-6 py-3 md:py-4 shadow-sm border border-border bg-background/80 backdrop-blur-md w-full max-w-full rounded-none"
    >
      <Link href="/home" className="flex gap-2 items-center">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={48}
          height={48}
          className="rounded-md overflow-hidden"
        />
        <h1 className="font-stack italic font-bold tracking-wider">
          Shallal Programming
        </h1>
      </Link>

      <nav className="hidden lg:flex items-center justify-center gap-8 text-foreground text-sm font-normal">
        {navLinks.map((link) => (
          <a
            key={link.label}
            className="hover:text-primary transition-colors"
            href={link.href}
          >
            <HoverText totalDuration={0.4}>{link.label}</HoverText>
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {isSmallerThanLg && (
          <StaggeredMenu
            items={[
              { label: "About", link: "/home#about" },
              { label: "Projects", link: "/home#projects" },
              { label: "Blogs", link: "/home#blogs" },
              { label: "Contact", link: "/contact-us" },
              ...(user
                ? [
                    {
                      label: "Manage Data",
                      link: "/dashboard/manage-data",
                    },
                    {
                      label: "Manage PDFs",
                      link: "/dashboard/create-pdf",
                    },
                  ]
                : []),
            ]}
            footer={
              !user ? (
                /* LOGGED OUT STATE: Button renders directly as a Link component */
                <Button
                  asChild
                  className="flex bg-background hover:bg-background/90 text-foreground px-5 py-2 rounded-full text-sm font-medium"
                >
                  <Link href="/log-in">
                    <HoverText totalDuration={0.4}>Log in</HoverText>
                  </Link>
                </Button>
              ) : (
                <FooterAccountControls
                  email={user.email ?? ""}
                  createdAt={user.created_at}
                />
              )
            }
            socialItems={socialLinks}
          >
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-border"
            >
              <MenuIcon />
            </Button>
          </StaggeredMenu>
        )}

        {/* Dynamic render check: Hidden during loading to prevent flash */}
        {loading ? (
          <div className="w-20 h-8 hidden md:block animate-pulse" />
        ) : !user ? (
          <Button
            asChild
            className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-full text-sm font-medium"
          >
            <Link href="/log-in">
              <HoverText totalDuration={0.4}>Log in</HoverText>
            </Link>
          </Button>
        ) : (
          <div className="hidden lg:flex">
            <MobileMenu email={user.email ?? ""} createdAt={user.created_at} />
          </div>
        )}
      </div>
    </header>
  );
}

function FooterAccountControls({
  email,
  createdAt,
}: FooterAccountControlsProps) {
  const [isPending, startTransition] = useTransition();

  const initials = email.split("@")[0].slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    startTransition(() => {
      signOutAction();
    });
  };

  return (
    <div className="w-full rounded-xl border border-border bg-gray-500  p-5 shadow-sm">
      {/* 1. Static User Identity Header Card */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-400 text-black! text-sm font-bold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate ">{email}</p>
          {createdAt && (
            <p className="text-xs  font-normal">
              Joined{" "}
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* 2. Horizontal Command Button Row */}
      <div className="flex items-center gap-3 pt-4">
        {/* Destructive Red Sign Out Button */}
        <Button
          type="button"
          variant="destructive"
          onClick={handleSignOut}
          disabled={isPending}
          className="flex-1 gap-2 text-white bg-red-700! hover:bg-red-600! rounded-lg text-sm font-medium cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          {isPending ? "Signing out" : "Sign Out"}
        </Button>
      </div>
    </div>
  );
}
