"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(useGSAP);

export interface StaggeredMenuItem {
  label: string;
  link: string;
  ariaLabel?: string;
  className?: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface StaggeredMenuProps {
  items: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  position?: "left" | "right";
  colors?: string[];
  accentColor?: string;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  className?: string;
  /** Pass a custom button/element to act as the trigger. Falls back to a default hamburger icon. */
  children?: React.ReactNode;
}

export default function StaggeredMenu({
  items,
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  position = "right",
  colors = ["#B497CF", "#5227FF"],
  accentColor = "#5227FF",
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  className,
  children,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  const scopeRef = useRef<HTMLDivElement | null>(null); // wraps trigger only, used for useGSAP scope
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const busyRef = useRef(false);

  // portal only mounts client-side
  useEffect(() => setMounted(true), []);

  // initial state — panel/prelayers live in the portal, so this runs once panel refs exist
  useGSAP(
    () => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;

      const layers = preContainer
        ? Array.from(preContainer.querySelectorAll<HTMLElement>(".sm-prelayer"))
        : [];
      preLayerElsRef.current = layers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...layers], { xPercent: offscreen });

      if (plusHRef.current && plusVRef.current) {
        gsap.set(plusHRef.current, { rotate: 0, transformOrigin: "50% 50%" });
        gsap.set(plusVRef.current, { rotate: 90, transformOrigin: "50% 50%" });
      }
    },
    { dependencies: [position, mounted] },
  );

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    const itemEls = Array.from(
      panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"),
    );
    const numberEls = Array.from(
      panel.querySelectorAll<HTMLElement>(
        ".sm-panel-list[data-numbering] .sm-panel-item",
      ),
    );
    const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
    const socialLinks = Array.from(
      panel.querySelectorAll<HTMLElement>(".sm-socials-link"),
    );

    const offscreen = position === "left" ? -100 : 100;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length)
      gsap.set(numberEls, { "--sm-num-opacity": 0 } as gsap.TweenVars);
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layers.forEach((el, i) => {
      tl.fromTo(
        el,
        { xPercent: offscreen },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07,
      );
    });

    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: offscreen },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime,
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart,
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            "--sm-num-opacity": 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: { each: 0.08, from: "start" },
          } as gsap.TweenVars,
          itemsStart + 0.1,
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle)
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart,
        );
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04,
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (!tl) {
      busyRef.current = false;
      return;
    }
    tl.eventCallback("onComplete", () => (busyRef.current = false));
    tl.play(0);
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current?.kill();

    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel"),
        );
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll<HTMLElement>(
            ".sm-panel-list[data-numbering] .sm-panel-item",
          ),
        );
        if (numberEls.length)
          gsap.set(numberEls, { "--sm-num-opacity": 0 } as gsap.TweenVars);

        const socialTitle =
          panel.querySelector<HTMLElement>(".sm-socials-title");
        const socialLinks = Array.from(
          panel.querySelectorAll<HTMLElement>(".sm-socials-link"),
        );
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon(target);
  }, [playOpen, playClose, animateIcon, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
  }, [playClose, animateIcon, onMenuClose]);

  useGSAP(
    () => {
      if (!closeOnClickAway || !open) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          panelRef.current &&
          !panelRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          closeMenu();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    },
    { dependencies: [open, closeOnClickAway, closeMenu] },
  );

  return (
    <div ref={scopeRef} className={`sm-scope inline-block ${className ?? ""}`}>
      {/* trigger — stays exactly where it's mounted, always above the portaled panel */}
      <div
        ref={triggerRef}
        onClick={toggleMenu}
        className="relative z-10000 inline-block cursor-pointer select-none"
        role="button"
        tabIndex={0}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="staggered-menu-panel"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleMenu();
          }
        }}
      >
        {children ?? (
          <span
            ref={iconRef}
            className="sm-icon relative w-[14px] h-[14px] inline-flex items-center justify-center"
          >
            <span
              ref={plusHRef}
              className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded -translate-x-1/2 -translate-y-1/2"
            />
            <span
              ref={plusVRef}
              className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded -translate-x-1/2 -translate-y-1/2"
            />
          </span>
        )}
      </div>

      {/* panel + prelayers — portaled to body so `fixed` is always relative to the real viewport,
          not to whatever transformed ancestor (e.g. the animated header) the trigger sits inside */}
      {mounted &&
        createPortal(
          <div
            className="sm-scope"
            style={
              accentColor
                ? ({ "--sm-accent": accentColor } as React.CSSProperties)
                : undefined
            }
            data-position={position}
            data-open={open || undefined}
          >
            <div
              ref={preLayersRef}
              className={`sm-prelayers fixed top-0 bottom-0 w-full lg sm:w-[420px] pointer-events-none z-[9997] ${
                position === "left" ? "left-0" : "right-0"
              }`}
              aria-hidden="true"
            >
              {(() => {
                const raw = colors.length
                  ? colors.slice(0, 4)
                  : ["#1e1e22", "#35353c"];
                const arr = [...raw];
                if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1);
                return arr.map((c, i) => (
                  <div
                    key={i}
                    className="sm-prelayer absolute top-0 right-0 h-full w-full"
                    style={{ background: c }}
                  />
                ));
              })()}
            </div>

            <aside
              id="staggered-menu-panel"
              ref={panelRef}
              className={`staggered-menu-panel fixed top-0 h-screen w-full sm:w-[420px] bg-white flex flex-col p-[6em_2em_2em_2em] overflow-y-auto z-[9998] backdrop-blur-[12px] ${
                position === "left" ? "left-0" : "right-0"
              }`}
              aria-hidden={!open}
            >
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="sm-close-btn absolute top-6 right-6 sm:right-8 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full text-black hover:bg-black/5 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1l14 14M15 1L1 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="flex-1 flex flex-col gap-5">
                <ul
                  className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
                  data-numbering={displayItemNumbering || undefined}
                >
                  {items.map((it, idx) => (
                    <li
                      key={it.label + idx}
                      className="sm-panel-itemWrap relative overflow-hidden leading-none"
                    >
                      <a
                        className={`sm-panel-item relative text-black font-semibold text-[4rem] sm:text-[3rem] leading-none tracking-[-1px] uppercase inline-block whitespace-nowrap no-underline pr-[2.5rem] ${it.className ?? ""}`}
                        href={it.link}
                        aria-label={it.ariaLabel ?? it.label}
                        data-index={idx + 1}
                      >
                        <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                          <span className="sm-panel-itemText inline-block transition-transform duration-300 ease-out">
                            {it.label}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                {displaySocials && socialItems.length > 0 && (
                  <div className="mt-auto pt-8 flex flex-col gap-3">
                    <h3
                      className="sm-socials-title m-0 text-base font-medium"
                      style={{ color: "var(--sm-accent, #ff0000)" }}
                    >
                      Socials
                    </h3>
                    <ul className="list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap">
                      {socialItems.map((s, i) => (
                        <li key={s.label + i}>
                          <a
                            href={s.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`sm-socials-link inline-flex items-center gap-2 text-[1.2rem] font-medium text-[#111] no-underline ${s.className ?? ""}`}
                          >
                            {s.icon && (
                              <span className="sm-socials-icon inline-flex w-[1.1em] h-[1.1em] shrink-0">
                                {s.icon}
                              </span>
                            )}
                            {s.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>,
          document.body,
        )}

      <style>{`
        .sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
        .sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after {
          counter-increment: smItem;
          content: counter(smItem, decimal-leading-zero);
         position: absolute; top: 0.15em; right: 5%;
          font-size: 0.35em; font-weight: 400;
          color: var(--sm-accent, #ff0000);
          opacity: var(--sm-num-opacity, 0);
          pointer-events: none;
        }
        .sm-scope .sm-panel-item { position: relative; }
      `}</style>
    </div>
  );
}
