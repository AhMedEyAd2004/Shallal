"use client";

import AnimatedTitle from "@/gsap-wrappers/animated-title";
import ScrollPinnedSlides from "@/gsap-wrappers/scroll-pinned-clipedSlides";
import ScrollRevealText from "@/gsap-wrappers/scroll-reveal";
import { Globe, Smartphone, Settings } from "lucide-react";

export default function AboutUs() {
  return (
    <ScrollPinnedSlides>
      {/* --- SLIDE 1: ABOUT US --- */}
      <section className="relative w-full h-full px-6 py-20 md:py-32 flex flex-col items-center justify-center bg-background overflow-hidden">
        {/* orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-foreground/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />

        <div className="relative w-full max-w-7xl space-y-8 md:space-y-12">
          <AnimatedTitle
            as="h2"
            rotateFrom={-40}
            className="text-4xl font-stack sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground text-center"
          >
            About Us
          </AnimatedTitle>

          <ScrollRevealText
            as="p"
            start="top 70%"
            end="bottom 60%"
            dimAutoAlpha={0.4}
            highlightColor="#2563eb"
            scrub={1}
            className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-extrabold leading-relaxed sm:leading-snug md:leading-tight tracking-tight text-pretty max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl text-center text-foreground/70 mx-auto"
          >
            We are a team of builders obsessed with craft. From web platforms to
            mobile apps and full-scale management systems, we design and
            engineer digital products that feel fast, look sharp, and hold up
            under real-world pressure.
          </ScrollRevealText>
        </div>
      </section>

      {/* --- SLIDE 2: OUR VISION --- */}
      <section className="relative w-full h-full px-6 py-20 md:py-32 flex flex-col items-center justify-center bg-background overflow-hidden">
        {/* orbs */}
        <div className="pointer-events-none absolute top-[-10%] right-[10%] h-80 w-80 rounded-full bg-foreground/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-15%] left-[5%] h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 h-112 w-md -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/5" />

        <div className="relative w-full max-w-7xl space-y-8 md:space-y-12 rounded-3xl p-8 md:p-14 backdrop-blur-xl">
          <h2 className="text-4xl font-stack sm:text-5xl md:text-7xl font-bold tracking-tight text-blue-600 dark:text-blue-400 text-center">
            Our Vision
          </h2>

          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-extrabold leading-relaxed sm:leading-snug md:leading-tight tracking-tight text-pretty max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl text-center text-foreground/70 mx-auto">
            We are engineering an open, lightning-fast digital backbone built
            for everyone. By rewriting modern architectural standards, our goal
            is to empower organizations to build accessible, secure, and
            incredibly immersive interfaces that move human progress forward.
          </p>
        </div>
      </section>

      {/* --- SLIDE 3: WHY CHOOSE US --- */}
      {/* Changed px-6 to px-0 on mobile to allow the horizontal track to overflow cleanly edge-to-edge */}
      <section className="relative w-full h-full px-0 md:px-6 py-20 md:py-32 flex flex-col items-center justify-center bg-background overflow-hidden">
        {/* orbs */}
        <div className="pointer-events-none absolute top-[-15%] left-[-10%] h-104 w-104 rounded-full bg-foreground/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-20%] right-[-5%] h-88 w-88 rounded-full bg-foreground/5 blur-3xl" />

        <div className="relative w-full max-w-7xl space-y-8 md:space-y-12 rounded-3xl backdrop-blur-xl">
          {/* Added horizontal padding on mobile here so heading remains centered on screen */}
          <h2 className="text-4xl font-stack sm:text-5xl md:text-7xl font-bold tracking-tight text-blue-700 dark:text-blue-300 text-center px-6 md:px-0">
            Why Choose Us?
          </h2>

          {/* Wrapper container allows track content overflow without layout breaking */}
          <div className="overflow-visible w-full">
            {/* 
              Target Horizontal Track: .why-choose-us-track
              Mobile: flex-row ensures cards line up horizontally.
              Desktop: md:grid resets smoothly into your original 3-column setup.
            */}
            <div className="why-choose-us-track flex flex-row md:grid md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 w-max md:w-full px-6 md:px-0 will-change-transform">
              {/* Web Applications */}
              {/* Added .sm-feature-card, explicit mobile sizing (w-[85vw]), and shrink-0 to preserve card dimensions */}
              <div className="sm-feature-card w-[85vw] sm:w-[340px] md:w-full shrink-0 rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-md p-6 sm:p-7 md:p-8 flex flex-col items-center text-center space-y-3 sm:space-y-4 transition-colors hover:bg-foreground/10">
                <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400">
                  <Globe
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  Web Applications
                </h3>
                <p className="text-sm md:text-base font-medium leading-relaxed text-foreground/70">
                  We build web apps that outperform the competition on speed,
                  accessibility, and scale, engineered right from the first line
                  of code.
                </p>
              </div>

              {/* Mobile Applications */}
              <div className="sm-feature-card w-[85vw] sm:w-[340px] md:w-full shrink-0 rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-md p-6 sm:p-7 md:p-8 flex flex-col items-center text-center space-y-3 sm:space-y-4 transition-colors hover:bg-foreground/10">
                <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400">
                  <Smartphone
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  Mobile Applications
                </h3>
                <p className="text-sm md:text-base font-medium leading-relaxed text-foreground/70">
                  Our mobile apps deliver smoother performance and a more
                  polished experience than anything else on the market.
                </p>
              </div>

              {/* Management Systems */}
              <div className="sm-feature-card w-[85vw] sm:w-[340px] md:w-full shrink-0 rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-md p-6 sm:p-7 md:p-8 flex flex-col items-center text-center space-y-3 sm:space-y-4 transition-colors hover:bg-foreground/10">
                <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400">
                  <Settings
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  Management Systems
                </h3>
                <p className="text-sm md:text-base font-medium leading-relaxed text-foreground/70">
                  We design management systems that are more reliable, more
                  secure, and easier to scale than the alternatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollPinnedSlides>
  );
}
