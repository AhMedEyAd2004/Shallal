"use client";

import { useState } from "react";
import ProjectCard from "@/components/custom/Project-card";
import AnimatedTitle from "@/gsap-wrappers/animated-title";
import { Button } from "@/components/ui/button";
import StaggeredProjectsGrid from "@/gsap-wrappers/StaggeredProjects";

const PAGE_SIZE = 3;

const projects = [
  {
    image: "/image.png",
    title: "Project 1",
    description: "Description for Project 1",
    year: 2023,
    href: "/projects/1",
  },
  {
    image: "/image.png",
    title: "Project 2",
    description: "Description for Project 2",
    year: 2023,
    href: "/projects/2",
  },
  {
    image: "/image.png",
    title: "Project 3",
    description: "Description for Project 3",
    year: 2023,
    href: "/projects/3",
  },
  {
    image: "/image.png",
    title: "Project 4",
    description: "Description for Project 4",
    year: 2024,
    href: "/projects/4",
  },
];

export default function Projects() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <section className="w-full text-foreground px-6 py-20 md:py-32 flex flex-col items-center overflow-x-hidden">
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
            <div key={project.href} data-project-card className="h-130">
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
