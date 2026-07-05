"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  isValidElement,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSwipeable } from "react-swipeable";
import { Button } from "@/components/ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);
// Timing for the two-phase "arc" motion. Phase 1 is the lift/throw-out,
// phase 2 is the settle into the final resting slot.
const PHASE_1 = 0.32;
const PHASE_2 = 0.38;
const TOTAL = PHASE_1 + PHASE_2;

function getStackStyle(index: number, baseZ: number) {
  return {
    x: 0,
    y: index * 14,
    scale: 1 - index * 0.06,
    rotate: index === 0 ? 0 : index % 2 === 0 ? 2 : -2,
    opacity: 1,
    zIndex: baseZ - index,
  };
}

type CardStackCarouselProps = {
  /** One element per card — give each child a stable, unique `key`. */
  children: ReactNode;
  /** Classes for the outer row (nav buttons + stack). */
  className?: string;
  /** Height of the card viewport (each child fills it via absolute inset-0). */
  heightClassName?: string;
};

export const CardStackCarousel = ({
  children,
  className,
  heightClassName = "h-72",
}: CardStackCarouselProps) => {
  const items = Children.toArray(children).filter(isValidElement);
  const ids = items.map((child, index) => String(child.key ?? index));

  const [order, setOrder] = useState<string[]>(ids);
  const cardEls = useRef<Map<string, HTMLDivElement>>(new Map());
  const isAnimating = useRef(false);
  const baseZ = useRef(items.length);
  const normalizeRef = useRef<ReturnType<
    typeof ScrollTrigger.normalizeScroll
  > | null>(null);

  const { contextSafe } = useGSAP(() => {
    // Snap every card into its starting stack position on mount.
    order.forEach((id, index) => {
      const el = cardEls.current.get(id);
      if (el) gsap.set(el, getStackStyle(index, baseZ.current));
    });
    normalizeRef.current = ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
    });
    return () => {
      normalizeRef.current?.kill?.();
    };
  }, []);

  // contextSafe only ever receives plain values as arguments — it never
  // closes over `.current` itself, which is what trips the
  // "refs during render" check when contextSafe(...) is called at the
  // top level of the component body.
  const playTransition = contextSafe(
    (
      activeEl: HTMLDivElement,
      others: { el: HTMLDivElement; targetIndex: number }[],
      direction: "next" | "prev",
      activeFinalIndex: number,
      newBase: number,
      onComplete: () => void,
    ) => {
      const tl = gsap.timeline({ onComplete });
      const finalStyle = getStackStyle(activeFinalIndex, newBase);

      if (direction === "next") {
        // Phase 1: the front card lifts up and arcs out to the right, as if
        // being picked up off the top of the stack. It stays on top
        // (highest z-index) the whole time it's in the air.
        tl.to(
          activeEl,
          {
            x: 150,
            y: -180,
            rotate: 15,
            scale: 1.06,
            ease: "power3.out",
            duration: PHASE_1,
          },
          0,
        );

        tl.set(activeEl, { zIndex: newBase - items.length }, PHASE_1);

        // Phase 2: arcs back left and down into its final resting slot
        // at the back of the stack.
        tl.to(
          activeEl,
          {
            x: finalStyle.x,
            y: finalStyle.y,
            rotate: finalStyle.rotate,
            scale: finalStyle.scale,
            duration: PHASE_2,
            ease: "power3.inOut",
          },
          PHASE_1,
        );
      } else {
        // Phase 1: arcs up and out to the left, lifting off the back of
        // the stack.
        tl.to(
          activeEl,
          {
            x: 150,
            y: -180,
            rotate: 15,
            scale: 1.06,
            duration: PHASE_1,
            ease: "power2.out",
          },
          0,
        );

        tl.set(activeEl, { zIndex: newBase + 1 }, PHASE_1);

        // Phase 2: swings back to the right and settles into the front
        // (active) slot.
        tl.to(
          activeEl,
          {
            x: finalStyle.x,
            y: finalStyle.y,
            rotate: finalStyle.rotate,
            scale: finalStyle.scale,
            duration: PHASE_2,
            ease: "power4.inOut",
          },
          PHASE_1,
        );
      }

      // The rest of the stack reflows to its new positions over the full
      // duration, so it feels like one continuous shuffle rather than two
      // separate motions.
      others.forEach(({ el, targetIndex }) => {
        const target = getStackStyle(targetIndex, newBase);
        tl.to(
          el,
          {
            x: target.x,
            y: target.y,
            scale: target.scale,
            rotate: target.rotate,
            duration: TOTAL,
            ease: "power2.inOut",
          },
          0,
        ).set(el, { zIndex: target.zIndex }, PHASE_1);
      });
    },
  );

  // Plain function — safe to read refs here, since this only ever runs
  // inside a click/swipe handler, never during render.
  const goTo = (direction: "next" | "prev") => {
    if (isAnimating.current) return;

    const newBase =
      direction === "next" ? baseZ.current + 1 : baseZ.current - 1;

    const activeId = direction === "next" ? order[0] : order[order.length - 1];
    const activeEl = cardEls.current.get(activeId);
    if (!activeEl) return;

    const newOrder =
      direction === "next"
        ? [...order.slice(1), order[0]]
        : [order[order.length - 1], ...order.slice(0, -1)];

    const others = order
      .filter((id) => id !== activeId)
      .map((id) => ({
        el: cardEls.current.get(id)!,
        targetIndex: newOrder.indexOf(id),
      }))
      .filter((c) => c.el);

    isAnimating.current = true;

    playTransition(
      activeEl,
      others,
      direction,
      newOrder.indexOf(activeId),
      newBase,
      () => {
        baseZ.current = newBase;
        setOrder(newOrder);
        isAnimating.current = false;
      },
    );
  };

  // Swipe right => next, swipe left => prev. Nothing else — no live
  // drag-follow, no snap-back, just the same goTo the buttons use.
  const swipeHandlers = useSwipeable({
    onTouchStartOrOnMouseDown: () => normalizeRef.current?.disable(),
    onTouchEndOrOnMouseUp: () => normalizeRef.current?.enable(),
    onSwipedRight: () => goTo("next"),
    onSwipedLeft: () => goTo("prev"),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <div
      className={
        className ?? "relative mx-auto flex w-full max-w-3xl items-center gap-6"
      }
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Previous"
        onClick={() => goTo("prev")}
        className="hidden shrink-0 rounded-full sm:inline-flex"
      >
        <ChevronLeft />
      </Button>

      <div
        {...swipeHandlers}
        className={`relative select-none flex-1 isolate  ${heightClassName}`}
      >
        {items.map((child, index) => {
          const id = ids[index];
          return (
            <div
              key={id}
              ref={(el) => {
                if (el) cardEls.current.set(id, el);
                else cardEls.current.delete(id);
              }}
              className="absolute inset-0"
              style={{ willChange: "transform, opacity" }}
            >
              {child}
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Next"
        onClick={() => goTo("next")}
        className="hidden shrink-0 rounded-full sm:inline-flex"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
