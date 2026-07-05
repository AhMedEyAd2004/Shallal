"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import StaggeredMenu from "@/components/custom/staggeredMenu";
import { GiftIcon, Link2Icon, MenuIcon } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ThemeToggle } from "@/components/static/theme-toggle";
import HoverText from "@/gsap-wrappers/Button-animation-onHover";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navLinks = [
  { label: "Products", href: "#" },
  { label: "Customer Stories", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const isSmallerThanLg = useMediaQuery("(max-width: 1024px)");

  useGSAP(
    () => {
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
      <Link href="#" className="flex gap-2 items-center">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={48}
          height={48}
          className="rounded-md overflow-hidden"
        />
        <h1 className="font-stack italic font-bold tracking-wider">Shallal Programming</h1>
      </Link>

      <nav className="hidden  lg:flex items-center justify-center gap-8 text-foreground text-sm font-normal">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            className="hover:text-primary transition-colors"
            href={link.href}
          >
            <HoverText totalDuration={0.4}>{link.label}</HoverText>
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {isSmallerThanLg && (
          <StaggeredMenu
            items={[
              {
                label: "About",
                link: "#",
                className:
                  "font-stack text-[clamp(2.75rem,10vw,10rem)] [&:hover_.sm-panel-itemText]:-rotate-3",
              },
              {
                label: "Contact",
                link: "#",
                className:
                  "font-stack text-[clamp(2.75rem,10vw,10rem)] [&:hover_.sm-panel-itemText]:-rotate-3",
              },
              {
                label: "Pricing",
                link: "#",
                className:
                  "font-stack text-[clamp(2.75rem,10vw,10rem)] [&:hover_.sm-panel-itemText]:-rotate-3",
              },
              {
                label: "Products",
                link: "#",
                className:
                  "font-stack text-[clamp(2.75rem,10vw,10rem)] [&:hover_.sm-panel-itemText]:-rotate-3",
              },
            ]}
            socialItems={[
              {
                label: "GitHub",
                link: "https://github.com",
                icon: <GiftIcon />,
              },
              {
                label: "LinkedIn",
                link: "https://linkedin.com",
                icon: <Link2Icon />,
              },
            ]}
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

        <Button
          asChild
          className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-full text-sm font-medium"
        >
          <Link href="#">
            <HoverText totalDuration={0.4}>Sign up</HoverText>
          </Link>
        </Button>
      </div>
    </header>
  );
}
