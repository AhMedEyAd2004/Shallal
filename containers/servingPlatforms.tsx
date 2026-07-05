import AnimatedTitle from "@/gsap-wrappers/animated-title";
import PlatformsServed, { CompanyItem } from "@/gsap-wrappers/PlatformsServed";

const companies: CompanyItem[] = Array.from({ length: 10 }, () => ({
  companyName: "Acme Corp",
  companyImage: "/logo.png",
  countryName: "Egypt",
  countryImage: "/egypt.png",
}));

export default function ServicedPlatforms() {
  return (
    <PlatformsServed companies={companies} logoSrc="/logo.png">
      <AnimatedTitle
        rotateFrom={-30}
        as="p"
        className="absolute top-1/2 -translate-y-1/2 right-[calc(50%+45px)] lg:right-[calc(50%+75px)] text-nowrap text-sm md:text-xl shrink-0 lg:text-4xl"
      >
        Served over
      </AnimatedTitle>

      <AnimatedTitle
        rotateFrom={30}
        as="p"
        className="absolute top-1/2 -translate-y-1/2 left-[calc(50%+35px)] lg:left-[calc(50%+60px)] text-nowrap px-3 py-1 shrink-0 text-sm md:text-xl lg:text-4xl"
      >
        <div>
          +{companies.length}
          <span> companies</span>
        </div>
      </AnimatedTitle>
    </PlatformsServed>
  );
}
