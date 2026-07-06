import {
  DartIcon,
  FigmaIcon,
  FlutterIcon,
  GsapIcon,
  NextjsIcon,
  PhpIcon,
  ReactIcon,
  TailwindcssIcon,
  TypescriptIcon,
  ZodIcon,
} from "@/components/static/logo-Svgs";
import { Button } from "@/components/ui/button";
import AnimatedTitle from "@/gsap-wrappers/animated-title";
import ScrollRotatingCircularWrapper from "@/gsap-wrappers/ScrollRotatingCircularWrapper";
import { ArrowRight, CalendarClockIcon } from "lucide-react";
import Link from "next/link";

const INNER_LOOP_ICONS = [
  <FigmaIcon key="inner-figma" className="text-4xl lg:text-6xl" />,
  <FlutterIcon key="inner-flutter" className="text-4xl lg:text-6xl" />,
  <DartIcon key="inner-dart" className="text-4xl lg:text-6xl" />,
  <TypescriptIcon key="outer-ts" className="text-4xl lg:text-6xl" />,
  <PhpIcon key="inner-php" className="text-4xl lg:text-6xl" />,
  <NextjsIcon key="outer-next" className="text-4xl fill-black lg:text-6xl" />,
  <ZodIcon key="inner-zod" className="text-4xl lg:text-6xl" />,
];

const OUTER_LOOP_ICONS = [
  <NextjsIcon key="outer-next" className="text-4xl fill-black lg:text-6xl  " />,
  <FlutterIcon key="inner-flutter" className="text-4xl lg:text-6xl" />,
  <TailwindcssIcon key="outer-tw" className="text-4xl  lg:text-6xl  " />,
  <ReactIcon key="outer-react" className="text-4xl  lg:text-6xl  " />,
  <PhpIcon key="outer-php" className="text-4xl  lg:text-6xl  " />,
  <FigmaIcon key="outer-figma" className="text-4xl  lg:text-6xl  " />,
  <ZodIcon key="outer-zod" className="text-4xl  lg:text-6xl  " />,
  <GsapIcon
    key="outer-gsap"
    className="text-4xl  lg:text-6xl  text-green-500"
  />,
  <TypescriptIcon key="outer-ts" className="text-4xl  lg:text-6xl " />,
];

export default function Hero() {
  return (
    <section className="h-svh w-dvw overflow-hidden">
      <div className="size-full relative flex justify-center items-center">
        <ScrollRotatingCircularWrapper
          items={OUTER_LOOP_ICONS}
          direction="counter-clockwise"
          className="-translate-y-1/2 lg:-translate-y-1/2 max-w-150 sm:max-w-full w-[140dvw] md:w-screen lg:w-[90vw] border-3 rotate-z-90 sm:rotate-z-0 rounded-full"
          elementClassName="-rotate-z-90 sm:rotate-z-0! bg-gray-300 p-3 rounded-2xl"
          radiusPercent={50}
          spreadAngle={{ base: 90, sm: 100, lg: 70 }}
        />

        <ScrollRotatingCircularWrapper
          direction="clockwise"
          items={INNER_LOOP_ICONS}
          className="-translate-y-1/2 lg:-translate-y-1/2 md:w-[80vw] lg:w-[70vw] border-3  hidden md:block rounded-full"
          elementClassName="rotate-z-0 bg-gray-300 p-3 rounded-2xl"
          radiusPercent={50}
          spreadAngle={{ base: 90, sm: 100, lg: 100 }}
        />

        <div className="flex flex-col items-center justify-center p-4 gap-4 sm:gap-5 lg:gap-6 text-center max-w-105 sm:max-w-2xl md:max-w-2xl lg:max-w-[65vw] select-none mx-auto tracking-normal z-10">
          <AnimatedTitle
            as="h2"
            duration={1.5}
            rotateFrom={-30}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-[70px] font-stack font-black text-slate-950 dark:text-slate-50 leading-[1.15] lg:leading-[1.1] tracking-tight transition-colors duration-200"
          >
            We engineer high-growth digital products
          </AnimatedTitle>

          <p className="font-inter text-sm sm:text-base md:text-lg lg:text-[20px] font-normal text-slate-700 dark:text-slate-300 leading-relaxed lg:leading-normal max-w-[90%] lg:max-w-[85%] transition-colors animate-in fade-in slide-in-from-bottom-50 duration-1000 delay-1000 ease-out fill-mode-both">
            We transform ideas into fast, secure, and scalable digital products
            that help businesses grow. From mobile apps and websites to complete
            business management systems, we deliver software designed for
            long-term success.
          </p>
          <div className="mt-2 flex md:w-auto max-w-80 flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center px-2">
            <Button className=" animate-in fade-in slide-in-from-bottom-50 duration-1000 delay-1000 ease-out fill-mode-both w-full sm:w-auto whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm md:text-[15px] py-3 px-6 md:p-5 rounded-full shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 dark:shadow-indigo-500/10 transition-all active:scale-98 will-change-transform cursor-pointer flex items-center justify-center gap-2">
              <p>Book a discovery call</p>
              <CalendarClockIcon className="size-4 md:size-5" />
            </Button>

            <Button
              asChild
              className=" animate-in fade-in slide-in-from-bottom-50 duration-1000 delay-1000 ease-out fill-mode-both w-full sm:w-auto whitespace-nowrap bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-850 dark:border-slate-800 dark:text-slate-200 font-bold text-sm md:text-[15px] py-3 px-6 md:p-5 rounded-full shadow-sm transition-all active:scale-98 will-change-transform cursor-pointer "
            >
              <Link
                href="/contact-us"
                className="flex items-center justify-center gap-1"
              >
                <p>Let&apos;s talk</p>
                <ArrowRight className="size-4 md:size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
