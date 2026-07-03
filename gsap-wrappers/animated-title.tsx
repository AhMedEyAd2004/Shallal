"use client";

import { JSX, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface AnimatedTitleProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  rotateFrom?: number;
  stagger?: number;
  duration?: number;
  start?: string;
}

export default function AnimatedTitle({
  children,
  as: Tag = "h2",
  className = "",
  stagger = 0.08,
  rotateFrom = 0,
  duration = 0.9,
  start = "top 85%",
}: AnimatedTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = containerRef.current?.querySelector(
        "[data-title]",
      ) as HTMLElement;
      if (!target) return;

      SplitText.create(target, {
        type: "lines",
        mask: "lines", // auto-wraps each line in an overflow-hidden mask, no manual DOM work
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            rotateZ: rotateFrom,
            opacity: 0,
            duration,
            stagger,
            ease: "power4.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start,
              toggleActions: "play none none reverse",
            },
          }),
      });
    },
    { scope: containerRef, dependencies: [children] },
  );

  return (
    <div ref={containerRef}>
      <Tag data-title className={className}>
        {children}
      </Tag>
    </div>
  );
}
