"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CircularWrapper from "@/components/custom/circular-logos";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ScrollRotatingCircularWrapperProps extends React.ComponentProps<
  typeof CircularWrapper
> {
  rotation?: number;
  direction?: "clockwise" | "counter-clockwise";
  start?: string;
  end?: string;
  scrub?: boolean | number;
  className?: string;
  markers?: boolean;
}

export default function ScrollRotatingCircularWrapper({
  rotation = 25,
  direction = "clockwise",
  start = "-50% top",
  end = "bottom top",
  scrub = true,
  className,
  ...circularProps
}: ScrollRotatingCircularWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const circle = wrapperRef.current?.firstElementChild as HTMLElement;
      const items = wrapperRef.current?.querySelectorAll<HTMLElement>(
        ".circular-wrapper-item",
      );
      if (!circle || !items?.length) return;

      const sign = direction === "clockwise" ? 1 : -1;
      const target = rotation * sign;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start,
          end,
          scrub,
          markers: true,
        },
        defaults: { ease: "none" },
      });

      // relative: animates FROM whatever rotation is already on the
      // element (e.g. the rotate-z-90 Tailwind class), not from 0
      tl.to(circle, { rotation: `+=${target}` }, 0).to(
        items,
        { rotation: `-=${target}` },
        0,
      );
    },
    {
      scope: wrapperRef,
      dependencies: [rotation, direction, start, end, scrub],
    },
  );

  return (
    <div
      ref={wrapperRef}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 aspect-square ${className || ""}`}
    >
      <CircularWrapper {...circularProps} containerClassName="" />
    </div>
  );
}
