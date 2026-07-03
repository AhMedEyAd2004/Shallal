import AnimatedTitle from "@/gsap-wrappers/animated-title";

export default function Projects() {
  return (
    <section className="w-full text-foreground px-6 py-20 md:py-32 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-5xl space-y-8 md:space-y-12">
        <AnimatedTitle
          as="h2"
          rotateFrom={-40}
          className="text-4xl font-stack sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground"
        >
          Projects
        </AnimatedTitle>
      </div>
    </section>
  );
}
