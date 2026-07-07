"use client";

import { useState } from "react";
import ProjectCard from "@/components/custom/Project-card";
import AnimatedTitle from "@/gsap-wrappers/animated-title";
import { Button } from "@/components/ui/button";
import StaggeredProjectsGrid from "@/gsap-wrappers/StaggeredProjects";

const PAGE_SIZE = 3;

export type ProjectData = {
  image?: string;
  images?: string[];
  title: string;
  description: string;
  year?: number | string;
  country?: string;
  href?: string;
  links?: { title: string; url: string }[];
  tags?: string[];
  testimonials?: any[];
};

interface ProjectsProps {
  initialProjects?: ProjectData[];
}

export default function Projects({ initialProjects = [] }: ProjectsProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Fallback to empty array if undefined
  const safeProjects = initialProjects || [];

  const visibleProjects = safeProjects.slice(0, visibleCount);
  const hasMore = visibleCount < safeProjects.length;

  return (
    <section
      id="projects"
      className="w-full text-foreground px-6 py-20 md:py-32 flex flex-col items-center overflow-x-hidden"
    >
      <div className="w-full max-w-7xl space-y-8 md:space-y-12">
        <AnimatedTitle
          as="h2"
          rotateFrom={-40}
          className="text-4xl font-stack sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground"
        >
          Projects
        </AnimatedTitle>

        <StaggeredProjectsGrid
          count={visibleProjects.length}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {visibleProjects.map((project) => (
            <div key={project.href} data-project-card className="h-[480px]">
              <ProjectCard {...project} />
            </div>
          ))}

          {hasMore && (
            <div className="col-span-full flex justify-center pt-4">
              <Button
                variant={"outline"}
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="rounded-full border border-white/10 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                View More
              </Button>
            </div>
          )}
        </StaggeredProjectsGrid>
      </div>
    </section>
  );
}
