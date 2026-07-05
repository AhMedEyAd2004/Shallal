"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import type React from "react";

gsap.registerPlugin(useGSAP);

type AnimatedContainerProps = React.ComponentProps<"div"> & {
  children?: React.ReactNode;
  delay?: number;
};

export default function AnimatedContainer({
  delay = 0.1,
  children,
  className,
  ...props
}: AnimatedContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(el, { filter: "blur(4px)", y: -8, opacity: 0 });

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;

            gsap.to(el, {
              filter: "blur(0px)",
              y: 0,
              opacity: 1,
              delay,
              duration: 0.8,
            });

            observer.disconnect();
          },
          { threshold: 0.1 },
        );

        observer.observe(el);

        return () => observer.disconnect();
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [delay] },
  );

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
}
