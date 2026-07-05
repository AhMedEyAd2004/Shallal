"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import Image from "next/image";
import LogoLoop, { LogoItem } from "@/components/static/LogoLoop";

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

export interface CompanyItem {
  companyName: string;
  companyImage: string;
  countryName: string;
  countryImage: string;
}

interface PlatformsServedProps {
  companies: CompanyItem[];
  logoSrc: string;
  children: React.ReactNode;
}

export default function PlatformsServed({
  companies,
  logoSrc,
  children,
}: PlatformsServedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);

  const alignSvgWrapper = () => {
    if (!logoRef.current || !svgWrapperRef.current) return;
    gsap.set(svgWrapperRef.current, { x: 0, y: 0 });

    const delta = MotionPathPlugin.getRelativePosition(
      svgWrapperRef.current,
      logoRef.current,
      [0.5, 0],
      [0.5, 0.9],
    );

    gsap.set(svgWrapperRef.current, {
      x: "+=" + delta.x,
      y: "+=" + delta.y,
    });
  };

  useGSAP(
    () => {
      if (svgWrapperRef.current) {
        timelinesRef.current.forEach((tl) => tl.kill());
        timelinesRef.current = [];

        gsap.utils
          .toArray<SVGPathElement>("[id^='path-']", containerRef.current)
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

            timelinesRef.current.push(tl);
          });
      }

      if (logoRef.current && svgWrapperRef.current) {
        alignSvgWrapper();
      }
    },
    { scope: containerRef },
  );

  useEffect(() => {
    const handleResize = () => {
      alignSvgWrapper();

      timelinesRef.current.forEach((tl) => {
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
        {children}

        <div
          ref={logoRef}
          className="relative shrink-0 size-8 lg:size-20 border rounded-2xl p-4 lg:p-5 box-content z-10 bg-background overflow-hidden"
        >
          <Image src={logoSrc} alt="Logo" fill />
        </div>
      </div>

      <div
        ref={svgWrapperRef}
        className="relative overflow-hidden w-full mx-4 max-w-150 h-50"
      >
        <svg
          viewBox="0 0 594 188"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
        <LogoLoop
          logos={companies as unknown as LogoItem[]}
          speed={80}
          gap={48}
          logoHeight={56}
          fadeOut
          className="[--logoloop-fadeColorAuto:var(--card)]!"
          pauseOnHover
          ariaLabel="Companies we work with"
          renderItem={(item, key) => {
            const company = item as unknown as CompanyItem;
            return (
              <div
                key={key}
                className="relative shrink-0 size-12 lg:size-16 "
                title={`${company.companyName} — ${company.countryName}`}
              >
                <Image
                  src={company.companyImage}
                  alt={company.companyName}
                  fill
                  className="object-contain rounded-lg"
                />
                <div className="absolute bottom-0 -right-1 size-6 rounded-full border-2 overflow-hidden border-border bg-background">
                  <Image
                    src={company.countryImage}
                    alt={company.countryName}
                    fill
                  />
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
