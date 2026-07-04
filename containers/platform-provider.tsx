"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import { RefreshCcw } from "lucide-react";
import AnimatedTitle from "@/gsap-wrappers/animated-title";

gsap.registerPlugin(MotionPathPlugin);

const PATH_COUNT = 7;

const PATH_COLORS = [
  { dot: "bg-red-500", tail: "after:bg-red-500" },
  { dot: "bg-blue-500", tail: "after:bg-blue-500" },
  { dot: "bg-purple-500", tail: "after:bg-purple-500" },
  { dot: "bg-emerald-500", tail: "after:bg-emerald-500" },
  { dot: "bg-indigo-500", tail: "after:bg-indigo-500" },
  { dot: "bg-amber-500", tail: "after:bg-amber-500" },
  { dot: "bg-fuchsia-500", tail: "after:bg-fuchsia-500" },
];

export default function PlatformProvider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);

  // Helper function to dynamically position the SVG wrapper relative to the logo node on mount/resize
  const alignSvgWrapper = () => {
    if (!logoRef.current || !svgWrapperRef.current) return;

    // Zero out any previous transformations to measure base bounding rectangles cleanly
    gsap.set(svgWrapperRef.current, { x: 0, y: 0 });

    const delta = MotionPathPlugin.getRelativePosition(
      svgWrapperRef.current,
      logoRef.current,
      [0.5, 0],
      [0.5, 1.15],
    );

    gsap.set(svgWrapperRef.current, {
      x: delta.x,
      y: delta.y,
    });
  };

  useGSAP(
    () => {
      if (!logoRef.current || !svgWrapperRef.current) return;

      // 1. Initial vector positioning calculation
      alignSvgWrapper();

      // Clear out any old timelines if this hook re-runs
      timelinesRef.current.forEach((tl) => tl.kill());
      timelinesRef.current = [];

      // 2. Build the dot motion paths loop
      gsap.utils
        .toArray<SVGPathElement>("[id^='path-']")
        .forEach((pathEl, i) => {
          const dot = dotRefs.current[i];
          if (!dot) return;

          const tl = gsap.timeline({ repeat: -1 });

          tl.set(dot, { autoAlpha: 1 })
            .to(dot, {
              motionPath: {
                path: pathEl,
                align: pathEl,
                alignOrigin: [0.5, 0.5],
                autoRotate: true,
                start: 0,
                end: 1,
              },
              duration: gsap.utils.random(1.2, 2.5),
              delay: gsap.utils.random(0.5, 3),
              ease: "power2.inOut",
            })
            .set(dot, { autoAlpha: 0 })
            .set(dot, { autoAlpha: 1 }, `+=${gsap.utils.random(0.5, 3)}`)
            .to(dot, {
              duration: gsap.utils.random(1.2, 2.5),
              motionPath: {
                path: pathEl,
                align: pathEl,
                alignOrigin: [0.5, 0.5],
                autoRotate: true,
                start: 1,
                end: 0,
              },
              ease: "power2.inOut",
            })
            .set(dot, { autoAlpha: 0 });

          // Keep track of active timelines so we can refresh them on window resizing
          timelinesRef.current.push(tl);
        });
    },
    { scope: containerRef },
  );

  // 3. EFFECT LAYER: Listens for resize events to force GSAP to refresh motion vector parameters
  useEffect(() => {
    const handleResize = () => {
      // Re-align the parent wrapper element relative to the responsive logo position
      alignSvgWrapper();

      // Loop through and force recalculation of internal tracking lines
      timelinesRef.current.forEach((tl) => {
        // Capture current progress point state, invalidate internal coordinates cache, and restart loop smoothly
        const progress = tl.progress();
        tl.invalidate().progress(progress);
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="size-full font-stack py-20 flex flex-col items-center"
    >
      <div className="flex relative w-full justify-center items-center h-20 lg:h-32">
        <AnimatedTitle
          rotateFrom={-30}
          as="p"
          className="absolute top-1/2 -translate-y-1/2 right-[calc(50%+45px)] lg:right-[calc(50%+75px)] text-nowrap text-sm md:text-xl shrink-0 lg:text-4xl"
        >
          Served over
        </AnimatedTitle>

        <AnimatedTitle
          rotateFrom={30}
          as="p"
          className="absolute top-1/2 -translate-y-1/2 left-[calc(50%+35px)] lg:left-[calc(50%+60px)] text-nowrap px-3 py-1 shrink-0 text-sm md:text-xl lg:text-4xl"
        >
          +100 companies
        </AnimatedTitle>

        <RefreshCcw
          ref={logoRef}
          className="shrink-0 size-8 lg:size-20 border rounded-2xl p-4 lg:p-5 box-content z-10 bg-background"
        />
      </div>

      <div
        ref={svgWrapperRef}
        className="relative overflow-hidden w-full mx-4 max-w-150 h-50"
      >
        <svg
          viewBox="0 0 594 188"
          fill="none"
          xmlns="http://w3.org"
          className="absolute inset-0 w-full h-full text-gray-300!"
          preserveAspectRatio="none"
        >
          <path
            id="path-0"
            d="M298.385 1.31244 C192.103 93.8769 123.249 135.12 0.384644 186.312"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            id="path-1"
            d="M298.385 1.31244 C236.846 84.6053 196.572 127.967 91.8846 186.312"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            id="path-2"
            d="M298.385 1.31244 C270.088 79.7015 245.549 121.459 188.385 186.312"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            id="path-3"
            d="M298.385 1.31244 V186.312"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            id="path-4"
            d="M298.385 1.31244 C328.623 85.3393 355.885 124.812 408.385 186.312"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            id="path-5"
            d="M298.385 1.31244 C361.174 89.4391 407.233 127.661 503.885 186.312"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            id="path-6"
            d="M298.385 1.31244 C412.885 96.3124 460.885 124.812 593.385 186.312"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>

        {Array.from({ length: PATH_COUNT }).map((_, i) => {
          const colors = PATH_COLORS[i % PATH_COLORS.length];
          return (
            <div
              key={i}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className={`dot absolute top-0 left-1/2 size-2 
                after:absolute after:h-px after:w-5 after:top-1/2 after:right-full after:-translate-y-1/2 
                ${colors.dot} ${colors.tail}`}
            />
          );
        })}
      </div>

      <div className="border font-inter border-border rounded-xl -mt-12 lg:-mt-8 bg-card p-5 w-full max-w-180 z-10 mx-5 text-foreground">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus error
        recusandae, maiores quaerat earum ea deleniti fugiat debitis veniam
        dolorum vero tenetur, quae eligendi accusantium sint iure adipisci modi
        reiciendis?
      </div>
    </div>
  );
}
