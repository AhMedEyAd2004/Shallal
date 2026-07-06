"use client";

import StaggeredMenu from "@/components/custom/staggeredMenu";
import { FacebookIcon } from "@/components/facebook-icon";
import { LinkedinIcon } from "@/components/linkedin-icon";
import { ThemeToggle } from "@/components/static/theme-toggle";
import { Button } from "@/components/ui/button";
import HoverText from "@/gsap-wrappers/Button-animation-onHover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const navLinks = [
  { label: "About us", href: "/home#about" },
  { label: "Projects", href: "/home#projects" },
  { label: "Blogs", href: "/home#blogs" },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const isSmallerThanLg = useMediaQuery("(max-width: 1024px)");

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

      <nav className="hidden  lg:flex items-center justify-center gap-8 text-foreground text-sm font-normal">
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
              {
                label: "About",
                link: "/home#about",
              },
              {
                label: "Projects",
                link: "/home#projects",
              },
              {
                label: "Blogs",
                link: "/home#blogs",
              },
              {
                label: "Contact",
                link: "/contact-us",
              },
            ]}
            socialItems={[
              {
                label: "facebook",
                link: "https://facebook.com",
                icon: <FacebookIcon />,
              },
              {
                label: "LinkedIn",
                link: "https://linkedin.com",
                icon: <LinkedinIcon />,
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
          <Link href="/log-in">
            <HoverText totalDuration={0.4}>Sign up</HoverText>
          </Link>
        </Button>
      </div>
    </header>
  );
}
