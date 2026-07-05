"use client";

import { JSX, useRef, Children } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface AnimatedTitleProps {
  children: React.ReactNode;
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
  const items = Children.toArray(children);

  useGSAP(
    () => {
      const targets =
        containerRef.current?.querySelectorAll("[data-title-item]");
      if (!targets || targets.length === 0) return;

      gsap.from(targets, {
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
      });
    },
    { scope: containerRef, dependencies: [children] },
  );

  return (
    <div ref={containerRef}>
      <Tag className={className}>
        {items.map((child, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <span data-title-item className="inline-block">
              {child}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
