"use client";

import { JSX, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface ScrollRevealTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  dimAutoAlpha?: number;
  baseColor?: string; // FIXED: Changed default to "currentColor" for theme-awareness
  dimColor?: string;
  highlightColor?: string;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  wordStagger?: number;
  wordDuration?: number;
}

export default function ScrollRevealText({
  children,
  as: Tag = "p",
  className = "",
  dimAutoAlpha = 0.3,
  baseColor = "currentColor", // FIXED: Will now naturally inherit text-neutral-950 or text-foreground
  dimColor = "#1e3a8a",
  highlightColor = "#2563eb",
  start = "top 80%",
  end = "bottom 40%",
  scrub = 0.5,
  wordStagger = 0.05,
  wordDuration = 0.15,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const target = containerRef.current?.querySelector(
        "[data-reveal-text]",
      ) as HTMLElement;
      if (!target) return;

      SplitText.create(target, {
        type: "words",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(self.words, {
            autoAlpha: dimAutoAlpha,
            color: dimColor,
          });

          return gsap.to(self.words, {
            keyframes: {
              "0%": { autoAlpha: dimAutoAlpha, color: dimColor },
              "50%": { autoAlpha: 1, color: highlightColor },
              "100%": { autoAlpha: 1, color: baseColor }, // FIXED: Resolves to your actual CSS text color
            },
            duration: wordDuration,
            stagger: wordStagger,
            ease: "none",
            scrollTrigger: {
              // markers: true,
              trigger: containerRef.current,
              start,
              end,
              scrub,
            },
          });
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [children, baseColor, dimColor, highlightColor],
    },
  );

  return (
    <div ref={containerRef}>
      <Tag data-reveal-text className={className}>
        {children}
      </Tag>
    </div>
  );
}
