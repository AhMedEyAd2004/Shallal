// circular-logos.tsx
import React from "react";

export type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

// `base` is required — it's the mobile-first fallback every other
// breakpoint cascades from if not explicitly overridden
export type ResponsiveAngle =
  | number
  | ({ base: number } & Partial<Record<Breakpoint, number>>);

interface CircularWrapperProps {
  items: React.ReactNode[];
  containerClassName?: string;
  elementClassName?: string;
  children?: React.ReactNode;
  spreadAngle?: ResponsiveAngle;
  radiusPercent?: number;
}

const BREAKPOINTS: Breakpoint[] = ["sm", "md", "lg", "xl", "2xl"];

// Static, always-present class list — required for Tailwind's JIT scanner to
// pick it up. Only the --a-* custom property VALUES change at runtime (via
// inline style), never the class names themselves. Each breakpoint falls
// back to the nearest smaller one that's actually set.
const ANGLE_VAR_CLASS =
  "[--a:var(--a-base)] " +
  "sm:[--a:var(--a-sm,var(--a-base))] " +
  "md:[--a:var(--a-md,var(--a-sm,var(--a-base)))] " +
  "lg:[--a:var(--a-lg,var(--a-md,var(--a-sm,var(--a-base))))] " +
  "xl:[--a:var(--a-xl,var(--a-lg,var(--a-md,var(--a-sm,var(--a-base)))))] " +
  "2xl:[--a:var(--a-2xl,var(--a-xl,var(--a-lg,var(--a-md,var(--a-sm,var(--a-base))))))]";

function normalizeAngle(
  value: ResponsiveAngle,
): { base: number } & Partial<Record<Breakpoint, number>> {
  return typeof value === "number" ? { base: value } : value;
}

function getAngles(count: number, centerAngle: number, angle: number) {
  if (count === 1) return [centerAngle];
  const start = centerAngle - angle / 2;
  const step = angle / (count - 1);
  return Array.from({ length: count }, (_, i) => start + step * i);
}

export default function CircularWrapper({
  items,
  containerClassName = "w-64 bg-slate-100 border border-slate-300",
  elementClassName = "",
  children,
  spreadAngle = 120,
  radiusPercent = 42,
}: CircularWrapperProps) {
  const angleMap = normalizeAngle(spreadAngle);
  const activeBreakpoints = (["base", ...BREAKPOINTS] as const).filter(
    (bp) => angleMap[bp as keyof typeof angleMap] !== undefined,
  );

  const rightItems: React.ReactNode[] = [];
  const leftItems: React.ReactNode[] = [];
  items.forEach((item, i) => {
    i <= (items.length - 1) / 2 ? rightItems.push(item) : leftItems.push(item);
  });

  const rightAnglesByBp = Object.fromEntries(
    activeBreakpoints.map((bp) => [
      bp,
      getAngles(rightItems.length, 0, angleMap[bp as keyof typeof angleMap]!),
    ]),
  ) as Record<string, number[]>;

  const leftAnglesByBp = Object.fromEntries(
    activeBreakpoints.map((bp) => [
      bp,
      getAngles(leftItems.length, 180, angleMap[bp as keyof typeof angleMap]!),
    ]),
  ) as Record<string, number[]>;

  const renderGroup = (
    group: React.ReactNode[],
    anglesByBp: Record<string, number[]>,
    prefix: string,
  ) =>
    group.map((item, index) => {
      const style: Record<string, string> = { "--r": String(radiusPercent) };
      activeBreakpoints.forEach((bp) => {
        style[`--a-${bp}`] = `${anglesByBp[bp][index]}deg`;
      });

      return (
        <div
          key={`${prefix}-${index}`}
          className={`absolute left-1/2 top-1/2 ${ANGLE_VAR_CLASS} transform-[translate(-50%,-50%)_rotate(var(--a))_translateX(calc(var(--r)*1cqw))_rotate(calc(-1*var(--a)))]`}
          style={style as React.CSSProperties}
        >
          <div
            className={`circular-wrapper-item will-change-transform ${elementClassName}`}
          >
            {item}
          </div>
        </div>
      );
    });

  return (
    <div
      className={`circular-wrapper-circle relative rounded-full flex items-center justify-center aspect-square @container ${containerClassName}`}
    >
      {children && <div className="z-10">{children}</div>}
      {renderGroup(rightItems, rightAnglesByBp, "right-item")}
      {renderGroup(leftItems, leftAnglesByBp, "left-item")}
    </div>
  );
}
