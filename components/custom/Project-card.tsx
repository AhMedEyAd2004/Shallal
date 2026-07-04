import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ResponsiveDrawer } from "./responsiveDrawer";

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  year: string | number;
  href: string;
}

export default function ProjectCard({
  image,
  title,
  description,
  year,
  href,
}: ProjectCardProps) {
  return (
    <ResponsiveDrawer>
      <div className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-black/50">
        {/* Image */}
        <div className="relative grow overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-2000 ease-out group-hover:scale-125"
          />
        </div>

        {/* Bottom info panel */}
        <div className="flex flex-col gap-2 bg-muted/50 p-5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            {year}
          </span>

          <h3 className="text-lg font-semibold text-card-foreground">
            {title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          <Link
            href={href}
            className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-transparent px-0 py-1 text-sm font-medium text-card-foreground/80 transition-colors hover:text-card-foreground"
          >
            Open
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </ResponsiveDrawer>
  );
}
