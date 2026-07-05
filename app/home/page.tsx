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
    <main className="">
      <Hero />
      <CustomSpacing className="border-t">
        <ServicedPlatforms />
      </CustomSpacing>
      <CustomSpacing>
        <AboutUs />
      </CustomSpacing>

      <CustomSpacing>
        <Projects />
      </CustomSpacing>
      <CustomSpacing>
        <Testimonial />
      </CustomSpacing>
      <StickyFooter />
    </main>
  );
}
