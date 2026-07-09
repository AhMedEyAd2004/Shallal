import CustomSpacing from "@/components/custom/customSpacingWrapper";
import AboutUs from "@/containers/about-us";
import { StickyFooter } from "@/containers/footer";
import Hero from "@/containers/hero";
import Projects from "@/containers/projects";
import ServicedPlatforms from "@/containers/servingPlatforms";
import Testimonial from "@/containers/Testimonial";
import {
  getProjects,
  getApprovedTestimonials,
  getServiceProvided,
  getSocialLinks,
} from "@/lib/supabase/queries";

export interface ProjectLink {
  title: string;
  url: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url_or_number: string;
}

export function normalizeLinksInput(raw: unknown): ProjectLink[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (l): l is ProjectLink =>
        l &&
        typeof l === "object" &&
        typeof l.title === "string" &&
        typeof l.url === "string",
    );
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, unknown>)
      .filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      )
      .map(([title, url]) => ({ title, url }));
  }
  return [];
}

export default async function Home() {
  // Fetch data in parallel
  const [dbProjects, dbTestimonials, dbServices, dbSocialLinks] =
    await Promise.all([
      getProjects(),
      getApprovedTestimonials(),
      getServiceProvided(),
      getSocialLinks(),
    ]);

  // Map social links to expected shape
  const socialLinks: SocialLink[] = (dbSocialLinks ?? []).map((s: any) => ({
    id: String(s.id),
    platform: s.platform,
    url_or_number: s.url_or_number,
  }));

  const phoneNumber =
    socialLinks.find((s) => s.platform === "phone number")?.url_or_number || "";
  const whatsapp =
    socialLinks.find((s) => s.platform === "whatsapp")?.url_or_number || "";

  // Map projects to expected props
  const projects = dbProjects.map((p: any) => {
    // If images is an array, take the first one as main image
    const imagesArray = Array.isArray(p.images) ? p.images : [];
    const mainImage = imagesArray.length > 0 ? imagesArray[0] : undefined;

    return {
      title: p.title,
      description: p.description,
      image: mainImage,
      images: imagesArray,
      href: `/projects/${p.id}`,
      country: p.country,
      year: p.created_at ? new Date(p.created_at).getFullYear() : "",
      tags: p.tags,
      links: normalizeLinksInput(p.links),
      testimonials: (p.testimonials ?? []).map((t: any) => ({
        id: String(t.id),
        text: t.comment,
        name: t.person_name,
        link: t.links,
        role: t.person_role,
        img: t.person_image_url,
      })),
    };
  });

  // Map testimonials to expected props
  const testimonials = dbTestimonials?.map((t: any) => ({
    id: String(t.id),
    text: t.comment,
    name: t.person_name,
    role: t.person_role,
    img: t.person_image_url || "/logo.png",
    links: normalizeLinksInput(t.projects?.links),
  }));

  // Map services to expected props
  const companies = dbServices.map((s: any) => ({
    companyName: s.title,
    companyImage: s.company_image_url,
    countryName: "", // Add to DB schema if needed
    countryImage: s.country_image_url,
  }));

  return (
    <main className="overflow-x-hidden">
      <Hero
        cta={{
          phoneNumber,
          whatsapp,
        }}
      />
      <CustomSpacing className="border-y">
        <ServicedPlatforms companies={companies} />
      </CustomSpacing>

      <AboutUs />

      <CustomSpacing className="border-t">
        <Projects initialProjects={projects} />
      </CustomSpacing>
      <CustomSpacing>
        <Testimonial testimonials={testimonials} />
      </CustomSpacing>
      <StickyFooter socialLinks={socialLinks} />
    </main>
  );
}
