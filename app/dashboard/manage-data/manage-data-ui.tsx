import { ProjectsManager } from "./projects-manager";
import { TestimonialsManager } from "./testimonials-manager";
import { CompaniesManager } from "./companies-manager";
import { SocialsManager } from "./socials-manager";

export function ManageDataUI({
  projects,
  projectsCount,
  testimonials,
  companies,
  socialLinks,
}: any) {
  return (
    <div className="space-y-12 pb-12">
      <ProjectsManager projects={projects} totalCount={projectsCount} />
      <div className="border-t border-border pt-12">
        <TestimonialsManager testimonials={testimonials} />
      </div>
      <div className="border-t border-border pt-12">
        <CompaniesManager companies={companies} />
      </div>
      <div className="border-t border-border pt-12">
        <SocialsManager socialLinks={socialLinks} />
      </div>
    </div>
  );
}
