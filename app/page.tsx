import CustomSpacing from "@/components/custom/customSpacingWrapper";
import CompaniesServed from "@/containers/companies-served";
import Hero from "@/containers/hero";
import OurVision from "@/containers/ourVision";
import PlatformProvider from "@/containers/platform-provider";
import Projects from "@/containers/projects";

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
        <OurVision />
      </CustomSpacing>
      <CustomSpacing>
        <Projects />
      </CustomSpacing>

      <div className="h-[2000px] w-screen bg-red-500"></div>
    </main>
  );
}
