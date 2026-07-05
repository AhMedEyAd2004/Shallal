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
  start = "top top",
  end = "bottom top",
  scrub = true,
  className,
  ...circularProps
}: ScrollRotatingCircularWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.config({ ignoreMobileResize: true });

      const circle = wrapperRef.current?.firstElementChild as HTMLElement;
      const items = wrapperRef.current?.querySelectorAll<HTMLElement>(
        ".circular-wrapper-item",
      );
      if (!circle || !items?.length) return;

      const sign = direction === "clockwise" ? 1 : -1;
      const target = rotation * sign;

      gsap.from(wrapperRef.current, {
        autoAlpha: 0,
        duration: 1.3,
        rotation: `+=30`,
      });

      gsap.from(circle, {
        autoAlpha: 0,
        duration: 1.3,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start,
          end,
          scrub,
        },
        defaults: { ease: "none" },
      });

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
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 aspect-square invisible ${className || ""}`}
    >
      <CircularWrapper {...circularProps} containerClassName="invisible" />
    </div>
  );
}
