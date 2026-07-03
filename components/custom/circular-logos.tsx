import React from "react";

interface CircularWrapperProps {
  items: React.ReactNode[];
  containerClassName?: string;
  elementClassName?: string;
  children?: React.ReactNode;
  spreadAngle?: number;
  spreadAngleMobile?: number;
  radiusPercent?: number;
}

export default function CircularWrapper({
  items,
  containerClassName = "w-64 bg-slate-100 border border-slate-300",
  elementClassName = "",
  children,
  spreadAngle = 120,
  spreadAngleMobile,
  radiusPercent = 42,
}: CircularWrapperProps) {
  // Fall back to the desktop angle if no mobile override is given
  const effectiveMobileAngle = spreadAngleMobile ?? spreadAngle;

  const rightItems: React.ReactNode[] = [];
  const leftItems: React.ReactNode[] = [];

  items.forEach((item, i) => {
    i <= (items.length - 1) / 2 ? rightItems.push(item) : leftItems.push(item);
  });

  const getAngles = (count: number, centerAngle: number, angle: number) => {
    if (count === 1) return [centerAngle];
    const start = centerAngle - angle / 2;
    const step = angle / (count - 1);
    return Array.from({ length: count }, (_, i) => start + step * i);
  };

  // Compute both desktop and mobile angle sets up front
  const rightAnglesDesktop = getAngles(rightItems.length, 0, spreadAngle);
  const leftAnglesDesktop = getAngles(leftItems.length, 180, spreadAngle);
  const rightAnglesMobile = getAngles(
    rightItems.length,
    0,
    effectiveMobileAngle,
  );
  const leftAnglesMobile = getAngles(
    leftItems.length,
    180,
    effectiveMobileAngle,
  );

  const renderGroup = (
    group: React.ReactNode[],
    anglesDesktop: number[],
    anglesMobile: number[],
    prefix: string,
  ) =>
    group.map((item, index) => (
      <div
        key={`${prefix}-${index}`}
        className="absolute left-1/2 top-1/2 [--a:var(--a-mobile)] md:[--a:var(--a-desktop)] transform-[translate(-50%,-50%)_rotate(var(--a))_translateX(calc(var(--r)*1cqw))_rotate(calc(-1*var(--a)))]"
        style={
          {
            "--a-desktop": `${anglesDesktop[index]}deg`,
            "--a-mobile": `${anglesMobile[index]}deg`,
            "--r": radiusPercent,
          } as React.CSSProperties
        }
      >
        <div
          className={`circular-wrapper-item will-change-transform ${elementClassName}`}
        >
          {item}
        </div>
      </div>
    ));

  return (
    <div
      className={`circular-wrapper-circle relative rounded-full flex items-center justify-center aspect-square @container ${containerClassName}`}
    >
      {children && <div className="z-10">{children}</div>}
      {renderGroup(
        rightItems,
        rightAnglesDesktop,
        rightAnglesMobile,
        "right-item",
      )}
      {renderGroup(leftItems, leftAnglesDesktop, leftAnglesMobile, "left-item")}
    </div>
  );
}
