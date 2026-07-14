"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { getCountryLabel } from "@/lib/country-utils";
import { FlagImage } from "./FlagImage";

interface ProjectCardProps {
  image?: string;
  title: string;
  description: string;
  year?: string | number;
  country?: string;
  href?: string;
  tags?: string[];
  dashboardActions?: React.ReactNode;
}

export default function ProjectCard({
  image = "",
  title,
  description,
  year = "",
  country,
  href = "",
  tags = [],
  dashboardActions,
  ...rest
}: ProjectCardProps & {
  links?: { title: string; url: string }[];
  images?: string[];
  testimonials?: any[];
}) {
  const card = (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-black/50 cursor-pointer">
      {/* Image */}
      <div className="relative grow overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className=" transition-transform duration-[2000ms] ease-out group-hover:scale-110"
        />
      </div>

      {/* Bottom info panel */}
      <div className="flex flex-col gap-2 bg-muted/50 p-5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            {year}
          </span>
          {country && (
            <div className="flex items-center gap-1.5">
              <FlagImage
                countryCode={country}
                countryName={country}
                width={20}
                height={20}
                className="shrink-0"
              />
              <span className="text-xs font-medium tracking-wide text-muted-foreground">
                {getCountryLabel(country)}
              </span>
            </div>
          )}
        </div>

        <h3
          className="text-lg font-semibold text-card-foreground truncate"
          dir="auto"
        >
          {title}
        </h3>

        <p
          className="line-clamp-2 text-sm leading-relaxed text-muted-foreground min-h-[46px]"
          dir="auto"
        >
          {description || " "}
        </p>

        <div className="flex justify-between items-center mt-2 h-6">
          <div className="flex gap-2 items-center overflow-hidden max-w-[70%]">
            {tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-medium uppercase tracking-wider truncate shrink-0 max-w-[80px]"
                dir="auto"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap shrink-0">
                +{tags.length - 2} more
              </span>
            )}
          </div>

          {dashboardActions ? (
            <div className="flex gap-2 z-10">{dashboardActions}</div>
          ) : (
            <Button
              variant={null}
              className="inline-flex items-center gap-1.5 rounded-full bg-transparent px-0 py-1 text-sm font-medium text-card-foreground/80 transition-colors hover:text-card-foreground pointer-events-none shrink-0"
            >
              Open
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Dashboard cards with actions: no outer link (actions handle navigation)
  if (dashboardActions) {
    return card;
  }

  // Public cards: the whole card navigates to the project page
  return (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  );
}
