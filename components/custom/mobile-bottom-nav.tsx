"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Home,
  User,
  Briefcase,
  Code2,
  Mail,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

type NavItem = {
  id: string; // matches the section's DOM id, e.g. <section id="about">
  label: string;
  icon: LucideIcon;
};

// Swap these for your actual section ids
const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function MobileBottomNav() {
  const [activeId, setActiveId] = useState(navItems[0].id);
  const containerRef = useRef<HTMLElement>(null);
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const iconRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Set up a ScrollTrigger per section to flip activeId as the user scrolls
  useGSAP(
    () => {
      const triggers = navItems.map((item) => {
        const section = document.getElementById(item.id);
        if (!section) return null;

        return ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveId(item.id),
          onEnterBack: () => setActiveId(item.id),
        });
      });

      return () => triggers.forEach((t) => t?.kill());
    },
    { scope: containerRef },
  );

  // Animate the pill expand/collapse whenever activeId changes
  useGSAP(
    () => {
      navItems.forEach((item) => {
        const isActive = item.id === activeId;
        const label = labelRefs.current[item.id];
        const iconWrap = iconRefs.current[item.id];
        if (!label || !iconWrap) return;

        const tl = gsap.timeline({
          defaults: { duration: 0.45, ease: "power3.out" },
        });

        if (isActive) {
          tl.to(
            label,
            { width: "auto", opacity: 1, marginLeft: 6, paddingRight: 14 },
            0,
          )
            .to(
              iconWrap,
              { scale: 1.05, backgroundColor: "var(--nav-active-bg, #eef2ff)" },
              0,
            )
            .to(iconWrap.querySelector("svg"), { color: "#4f46e5" }, 0);
        } else {
          tl.to(
            label,
            { width: 0, opacity: 0, marginLeft: 0, paddingRight: 0 },
            0,
          )
            .to(iconWrap, { scale: 1, backgroundColor: "rgba(0,0,0,0)" }, 0)
            .to(iconWrap.querySelector("svg"), { color: "#6b7280" }, 0);
        }
      });
    },
    { dependencies: [activeId], scope: containerRef },
  );

  const handleClick = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    gsap.to(window, {
      duration: 0.8,
      ease: "power2.inOut",
      scrollTo: { y: section, offsetY: 0 },
    });
  };

  return (
    <nav
      ref={containerRef}
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex items-center justify-around bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.08)] px-2 py-3"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="flex items-center"
          >
            <div
              ref={(el) => {
                iconRefs.current[item.id] = el;
              }}
              className="flex items-center rounded-full pl-3 py-2 overflow-hidden"
            >
              <Icon
                className="w-5 h-5 shrink-0 text-gray-500"
                strokeWidth={2}
              />
              <span
                ref={(el) => {
                  labelRefs.current[item.id] = el;
                }}
                className="inline-block overflow-hidden whitespace-nowrap text-sm font-medium text-indigo-600 opacity-0"
                style={{ width: 0 }}
              >
                {item.label}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
