import CustomSpacing from "@/components/custom/customSpacingWrapper";
import AboutUs from "@/containers/about-us";
import { StickyFooter } from "@/containers/footer";
import Hero from "@/containers/hero";
import Projects from "@/containers/projects";
import ServicedPlatforms from "@/containers/servingPlatforms";
import Testimonial from "@/containers/Testimonial";

export default async function Home() {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1000);
  });

  return (
    <main className="overflow-x-hidden">
      <Hero />
      <CustomSpacing className="border-y">
        <ServicedPlatforms />
      </CustomSpacing>

      <AboutUs />

      <CustomSpacing className="border-t">
        <Projects />
      </CustomSpacing>
      <CustomSpacing>
        <Testimonial />
      </CustomSpacing>
      <StickyFooter />
    </main>
  );
}
