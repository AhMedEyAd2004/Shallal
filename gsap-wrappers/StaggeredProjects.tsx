"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StaggeredProjectsGridProps {
  children: React.ReactNode;
  count: number; // number of currently rendered cards — triggers re-run when it changes
  className?: string;
}

export default function StaggeredProjectsGrid({
  children,
  count,
  className,
}: StaggeredProjectsGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-project-card]:not([data-animated='true'])",
        containerRef.current,
      );

      if (!cards.length) return;

      cards.forEach((card) => card.setAttribute("data-animated", "true"));
      gsap.set(cards, { opacity: 0, y: 60 });

      if (isFirstRun.current) {
        // First batch: reveal as the section scrolls into view
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        });
        isFirstRun.current = false;
      } else {
        // Cards added via "View More" — user just triggered this, so they're
        // already in/near view. Play immediately instead of waiting on scroll.
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        });
      }
    },
    { scope: containerRef, dependencies: [count] },
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
