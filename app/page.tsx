import CustomSpacing from "@/components/custom/customSpacingWrapper";
import CompaniesServed from "@/containers/companies-served";
import Hero from "@/containers/hero";
import AboutUs from "@/containers/about-us";
import PlatformProvider from "@/containers/platform-provider";
import Projects from "@/containers/projects";
import Testimonial from "@/containers/Testimonial";
import { StickyFooter } from "@/containers/footer";

export default async function Home() {
  // await new Promise<void>((resolve) => {
  //   setTimeout(resolve, 1000);
  // });

  return (
    <main className="">
      <Hero />
      <CustomSpacing className="border-t">
        <CompaniesServed />
      </CustomSpacing>
      <CustomSpacing>
        <PlatformProvider />
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
