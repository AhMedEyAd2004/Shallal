"use client";

import { useRef, Children } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollPinnedSlidesProps {
  children: React.ReactNode[];
}

export default function ScrollPinnedSlides({
  children,
}: ScrollPinnedSlidesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const slideCount = Children.count(children);
  const lineCount = Math.max(slideCount - 1, 0);

  useGSAP(
    () => {
      ScrollTrigger.config({ ignoreMobileResize: true });
      ScrollTrigger.normalizeScroll({ allowNestedScroll: true, });
      // let normalizer: ReturnType<typeof ScrollTrigger.normalizeScroll> | null =
      //   null;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        anticipatePin: 1,
        // onEnter: () => {
        //   normalizer = ScrollTrigger.normalizeScroll({
        //     allowNestedScroll: true,
        //   });
        // },
        // onLeave: () => {
        //   if (normalizer && typeof normalizer.kill === "function")
        //     normalizer.kill();
        //   normalizer = null;
        // },
        // onEnterBack: () => {
        //   normalizer = ScrollTrigger.normalizeScroll({
        //     allowNestedScroll: true,
        //   });
        // },
        // onLeaveBack: () => {
        //   if (normalizer && typeof normalizer.kill === "function")
        //     normalizer.kill();
        //   normalizer = null;
        // },
      });

      const panels = gsap.utils.toArray<HTMLElement>(".pinned-panel");
      const lines = gsap.utils.toArray<HTMLElement>(".clip-line");
      if (panels.length <= 1) return;

      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP LAYOUT (768px and up)
      // ==========================================
      mm.add("(min-width: 768px)", () => {
        const mobileTrack = containerRef.current?.querySelector<HTMLElement>(
          ".why-choose-us-track",
        );
        if (mobileTrack) gsap.set(mobileTrack, { x: 0 });

        gsap.set(panels, { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0 });
        gsap.set(lines, { bottom: "0%", autoAlpha: 1 });

        const calculatedDistance = `${(panels.length - 1) * 100}%`;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${calculatedDistance}+500px`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const duration = 1;

        panels.forEach((panel, index) => {
          if (index === panels.length - 1) return;

          const pos = index * duration;

          tl.to(
            panel,
            { clipPath: "inset(0% 0% 100% 0%)", ease: "none", duration },
            pos,
          );

          const line = lines[index];
          if (line) {
            tl.fromTo(
              line,
              { bottom: "0%", opacity: "100%", autoAlpha: 1 },
              {
                bottom: "100%",
                ease: "none",
                duration,
              },
              pos,
            );
            tl.set(line, { autoAlpha: 0 }, pos + duration);
          }
        });

        // Add a reading cushion so the last slide is fully visible before unpinning
        tl.to({}, { duration: 0.5 });
      });

      // ==========================================
      // MOBILE LAYOUT (Under 768px)
      // ==========================================
      mm.add("(max-width: 767px)", () => {
        const mobileTrack = containerRef.current?.querySelector<HTMLElement>(
          ".why-choose-us-track",
        );
        const horizontalCards = gsap.utils.toArray<HTMLElement>(
          ".sm-feature-card",
          containerRef.current,
        );

        if (!mobileTrack || horizontalCards.length === 0) return;

        // Reset elements for clean mobile flow initialization
        gsap.set(panels, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(lines, { bottom: "0%", autoAlpha: 1 });
        gsap.set(mobileTrack, { x: 0 }); // Hard reset tracking for measurement

        // 🚀 CRASH FIX: Properly grab the first element using array indexing [0]
        const firstCardRect = horizontalCards[0].getBoundingClientRect();
        const lastCardRect =
          horizontalCards[horizontalCards.length - 1].getBoundingClientRect();

        // Target: Find the center coordinate of the current viewport window
        const targetLeftPosition = (window.innerWidth - lastCardRect.width) / 2;

        // Exact travel distance needed to position the last card dead center responsively
        const totalHorizontalTravel =
          lastCardRect.left -
          firstCardRect.left +
          (firstCardRect.left - targetLeftPosition);

        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 5 + 50}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
          },
        });

        const segmentDuration = 1;

        // 1. Clip Slide 1 Out
        mobileTimeline.to(
          panels[0],
          {
            clipPath: "inset(0% 0% 100% 0%)",
            ease: "none",
            duration: segmentDuration,
          },
          0,
        );

        if (lines[0]) {
          mobileTimeline.fromTo(
            lines[0],
            { bottom: "0%", autoAlpha: 1 },
            {
              bottom: "100%",
              ease: "none",
              duration: segmentDuration,
            },
            0,
          );
          mobileTimeline.set(lines[0], { autoAlpha: 0 }, segmentDuration);
        }

        // 2. Clip Slide 2 Out
        mobileTimeline.to(
          panels[1],
          {
            clipPath: "inset(0% 0% 100% 0%)",
            ease: "none",
            duration: segmentDuration,
          },
          segmentDuration,
        );

        if (lines[1]) {
          mobileTimeline.fromTo(
            lines[1],
            { bottom: "0%", autoAlpha: 1 },
            {
              bottom: "100%",
              ease: "none",
              duration: segmentDuration,
            },
            segmentDuration,
          );
          mobileTimeline.set(lines[1], { autoAlpha: 0 }, segmentDuration * 2);
        }

        // 3. Horizontal Card translation
        // Dropping horizontal translation duration down to 2.7 leaves an intentional 0.3 dead zone gap.
        // Combined with our '+ 50' on the scroll endpoint, it completely locks the view for 50px before resuming.
        mobileTimeline.to(
          mobileTrack,
          {
            x: -totalHorizontalTravel,
            ease: "none",
            duration: 2.7,
          },
          segmentDuration * 2,
        );

        // 4. Smooth focus scaling and visibility pop for the cards
        horizontalCards.forEach((card, index) => {
          if (index === 0) return;

          mobileTimeline.fromTo(
            card,
            { opacity: 0.3, scale: 0.93 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
            },
            segmentDuration * 2 + (index / horizontalCards.length) * 2.2,
          );
        });

        // 5. Add an empty tween to create a generous reading cushion for the final card
        mobileTimeline.to({}, { duration: 0.8 });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-background"
    >
      {Children.map(children, (slide, index) => (
        <div
          key={index}
          className="pinned-panel absolute inset-0 w-full h-full overflow-hidden"
          style={{
            zIndex: slideCount - index,
            clipPath: "inset(0% 0% 0% 0%)",
          }}
        >
          {slide}
        </div>
      ))}

      {Array.from({ length: lineCount }).map((_, index) => (
        <div
          key={index}
          className="clip-line pointer-events-none absolute left-1/2 bottom-0 w-[90%] -translate-x-1/2"
          style={{ zIndex: slideCount - index + 1 }}
        >
          <div className="absolute inset-x-0 -top-3 -bottom-3 bg-[linear-gradient(to_right,transparent,rgba(59,130,246,0.6)_20%,rgba(96,165,250,0.8)_50%,rgba(59,130,246,0.6)_80%,transparent)] blur-md" />
          <div className="relative h-0.5 w-full rounded-full bg-[linear-gradient(to_right,transparent,rgba(59,130,246,0.95)_20%,rgba(147,197,253,1)_50%,rgba(59,130,246,0.95)_80%,transparent)]" />
        </div>
      ))}
    </div>
  );
}
