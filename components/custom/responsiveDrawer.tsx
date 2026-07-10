"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export function ResponsiveDrawer({
  children,
  title,
  description,
  content,
  footer,
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)"); // md breakpoint
  const direction = isDesktop ? "right" : "bottom";

  // Catch and toggle the GSAP ScrollNormalizer instance
  useEffect(() => {
    // Only execute if ScrollTrigger and the method exist
    if (typeof window !== "undefined" && ScrollTrigger.normalizeScroll) {
      const normalizer = ScrollTrigger.normalizeScroll();

      if (open) {
        normalizer?.disable();
      } else {
        normalizer?.enable();
      }
    }
  }, [open]);

  return (
    <Drawer direction={direction} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        className={
          isDesktop
            ? "!w-screen !max-w-none rounded-none border-0 !top-16 !h-[calc(100vh-4rem)] z-[110]"
            : "data-[vaul-drawer-direction=bottom]:h-[95dvh] data-[vaul-drawer-direction=bottom]:max-h-[95dvh] z-[110]"
        }
      >
        <DrawerHeader
          className={
            isDesktop
              ? "max-w-screen-xl mx-auto w-full flex flex-row items-center gap-4"
              : ""
          }
        >
          {isDesktop ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              title="Go back"
              className="shrink-0 w-fit ml-3 gap-2 px-3"
            >
              <ArrowLeft className="h-5 w-5" />
              <DrawerTitle className="text-base font-medium">Back</DrawerTitle>
            </Button>
          ) : (
            <DrawerTitle>{title || "Project Details"}</DrawerTitle>
          )}
        </DrawerHeader>
        <div
          className={
            isDesktop
              ? "max-w-screen-xl mx-auto w-full p-4 md:py-0 sm:px-6 no-scrollbar overflow-y-auto"
              : "no-scrollbar overflow-y-auto px-4 py-2"
          }
        >
          {/* The title is intentionally not rendered here because it is provided inside the content itself for a custom two-column layout */}
          {content}
        </div>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
