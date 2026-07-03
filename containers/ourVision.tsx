import AnimatedTitle from "@/gsap-wrappers/animated-title";
import ScrollRevealText from "@/gsap-wrappers/scroll-reveal";

export default function OurVision() {
  return (
    <section className="w-full text-foreground px-6 py-20 md:py-32 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-5xl space-y-8 md:space-y-12">
        <AnimatedTitle
          as="h2"
          rotateFrom={-40}
          className="text-4xl font-stack sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground"
        >
          Our Vision
        </AnimatedTitle>

        <ScrollRevealText
          start="top 70%"
          end="bottom 60%"
          dimAutoAlpha={0.4}
          highlightColor="#2563eb"
          scrub={1}
          className="px-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight max-w-6xl text-neutral-950"
        >
          We are engineering an open, lightning-fast digital backbone built for
          everyone. By rewriting modern architectural standards, our goal is to
          empower organizations to build accessible, secure, and incredibly
          immersive interfaces that move human progress forward.
        </ScrollRevealText>
      </div>
    </section>
  );
}
