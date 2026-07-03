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
import ScrollRotatingCircularWrapper from "@/gsap-wrappers/ScrollRotatingCircularWrapper";
import { ArrowRight, CalendarClockIcon } from "lucide-react";

const INNER_LOOP_ICONS = [
  <FigmaIcon key="inner-figma" className="text-4xl lg:text-6xl" />,
  <FlutterIcon key="inner-flutter" className="text-4xl lg:text-6xl" />,
  <DartIcon key="inner-dart" className="text-4xl lg:text-6xl" />,
  <TypescriptIcon key="outer-ts" className="text-4xl lg:text-6xl" />,
  <PhpIcon key="inner-php" className="text-4xl lg:text-6xl" />,
  <NextjsIcon key="outer-next" className="text-4xl lg:text-6xl" />,
  <ZodIcon key="inner-zod" className="text-4xl lg:text-6xl" />,
];

const OUTER_LOOP_ICONS = [
  <NextjsIcon key="outer-next" className="text-4xl  lg:text-6xl  " />,
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
  <TypescriptIcon key="outer-ts" className="text-4xl  lg:text-6xl  " />,
];
export default function Hero() {
  return (
    <section className="h-dvh w-dvw overflow-hidden">
      <div className="size-full relative flex justify-center items-center">
        <ScrollRotatingCircularWrapper
          spreadAngleMobile={80}
          items={OUTER_LOOP_ICONS}
          direction="counter-clockwise"
          containerClassName="absolute! top-1/2 left-1/2 -translate-1/2 w-[140dvw] lg:w-[80vw] border-3 rotate-z-90 lg:rotate-z-0"
          elementClassName="-rotate-z-90 lg:rotate-z-0 bg-gray-300 p-3 rounded-2xl"
          radiusPercent={50}
          spreadAngle={60}
        />
        <ScrollRotatingCircularWrapper
          direction="clockwise"
          items={INNER_LOOP_ICONS}
          containerClassName="absolute! top-1/2 left-1/2 -translate-1/2 w-[60vw] border-3 hidden lg:block "
          elementClassName=" bg-gray-300 p-3 rounded-2xl"
          radiusPercent={50}
          spreadAngle={70}
        />
        <div className="flex flex-col items-center justify-center p-4 gap-4 sm:gap-5 lg:gap-6 text-center max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-[856px] select-none mx-auto tracking-normal">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-[70px] font-stack font-black text-slate-950 leading-[1.15] lg:leading-[1.1] tracking-tight">
            We engineer high-growth digital products
          </h2>

          <p className="font-inter text-sm sm:text-base md:text-lg lg:text-[20px] font-normal text-slate-700 leading-relaxed lg:leading-normal max-w-[90%] lg:max-w-[85%]">
            From modern web platforms to native mobile apps, we write clean,
            scalable code that brings your product vision to life.
          </p>

          <div className="mt-2 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center px-2">
            <Button className="w-full sm:w-auto whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm md:text-[15px] py-3 px-6 md:p-5 rounded-full shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all active:scale-98 will-change-transform cursor-pointer flex items-center justify-center gap-2">
              <p>Book a discovery call</p>
              <CalendarClockIcon />
            </Button>

            <Button className="w-full sm:w-auto whitespace-nowrap bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm md:text-[15px] py-3 px-6 md:p-5 rounded-full shadow-sm transition-all active:scale-98 will-change-transform cursor-pointer flex items-center justify-center gap-2">
              <p>Let&apos;s talk</p>
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
