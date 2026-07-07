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
        className="
          data-[vaul-drawer-direction=bottom]:h-[95dvh]
          data-[vaul-drawer-direction=bottom]:max-h-[95dvh]
          data-[vaul-drawer-direction=right]:w-full
          data-[vaul-drawer-direction=right]:sm:max-w-md
          z-110
        "
      >
        <DrawerHeader>
          <DrawerTitle>Project Details</DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 py-2">{content}</div>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
