"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

interface HoverTextProps {
  children: string;
  className?: string;
  totalDuration?: number; // Total seconds for the whole block to animate
}

export default function HoverText({
  children,
  className = "",
  totalDuration = 0.55, // Default total time
}: HoverTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitText | null>(null);

  // 1. Initialize SplitText safely inside the useGSAP hook
  useGSAP(
    () => {
      if (!textRef.current) return;

      splitRef.current = new SplitText(textRef.current, {
        type: "words,chars",
        charsClass: "inline-block will-change-transform",
      });

      return () => {
        splitRef.current?.revert();
      };
    },
    { scope: containerRef },
  );

  // 2. Pure React event handler (No contextSafe in the render path)
  const handleMouseEnter = () => {
    if (!splitRef.current?.chars.length) return;

    // Use standard GSAP timeline with explicit scope targeting
    const timeline = gsap.timeline({ scope: containerRef });
    const halfDuration = totalDuration / 2;

    timeline
      // Step 1: Drop out of frame
      .to(splitRef.current.chars, {
        y: "100%",
        opacity: 0,
        duration: halfDuration,
        stagger: { amount: halfDuration * 0.4 },
        ease: "power2.in",
      })
      // Step 2: Instant reset above frame
      .set(splitRef.current.chars, {
        y: "-100%",
      })
      // Step 3: Fall back down into place
      .to(splitRef.current.chars, {
        y: "0%",
        opacity: 1,
        duration: halfDuration,
        stagger: { amount: halfDuration * 0.4 },
        ease: "power2.out",
      });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className="inline-block overflow-hidden vertical-align-middle cursor-pointer"
    >
      <div ref={textRef} className={className}>
        {children}
      </div>
    </div>
  );
}
