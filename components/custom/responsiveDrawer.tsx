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

export function ResponsiveDrawer({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)"); // md breakpoint
  const direction = isDesktop ? "right" : "bottom";

  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        className="
          data-[vaul-drawer-direction=bottom]:h-[95vh]
          data-[vaul-drawer-direction=bottom]:max-h-[95vh]
          data-[vaul-drawer-direction=right]:w-full
          data-[vaul-drawer-direction=right]:sm:max-w-md
          z-110
        "
      >
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <p
              key={index}
              className="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          ))}
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
