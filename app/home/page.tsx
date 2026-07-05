import CustomSpacing from "@/components/custom/customSpacingWrapper";
import CompaniesServed from "@/components/static/companies-served";
import Hero from "@/containers/hero";
import AboutUs from "@/containers/about-us";
import PlatformProvider from "@/gsap-wrappers/PlatformsServed";
import Projects from "@/containers/projects";
import Testimonial from "@/containers/Testimonial";
import { StickyFooter } from "@/containers/footer";
import ServiedPlatforms from "@/containers/servingPlatforms";

export default async function Home() {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 1000);
  });

  return (
    <main className="">
      <Hero />
      <CustomSpacing className="border-t">
        <ServiedPlatforms />
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
